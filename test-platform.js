// Comprehensive automated test suite for Hammad's Journal
const http = require("http");

const BASE_URL = "http://localhost:3000";

async function request(path, options = {}) {
  const url = new URL(path, BASE_URL);
  return new Promise((resolve, reject) => {
    const req = http.request(
      url,
      {
        method: options.method || "GET",
        headers: options.headers || {},
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body,
          });
        });
      }
    );
    req.on("error", reject);
    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=================================================");
  console.log("STARTING TEST SUITE: HAMMAD'S JOURNAL");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = "") {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  try {
    // -----------------------------------------------------------------
    // TEST GROUP 1: PUBLIC HOMEPAGE & VISIBILITY RESTRICTIONS
    // -----------------------------------------------------------------
    console.log("--- Group 1: Public Website & Navigation ---");
    const homeRes = await request("/");
    assert(homeRes.status === 200, "Homepage returns status 200");
    assert(
      homeRes.body.includes("Thoughts, Ideas &amp; Perspectives.") ||
      homeRes.body.includes("Thoughts, Ideas & Perspectives."),
      "Homepage contains exact main heading 'Thoughts, Ideas & Perspectives.'"
    );
    assert(
      homeRes.body.includes("A personal space for exploring ideas"),
      "Homepage contains supporting description"
    );
    assert(
      !homeRes.body.includes("Write Article") &&
      !homeRes.body.includes("Admin Dashboard") &&
      !homeRes.body.includes("Edit Article") &&
      !homeRes.body.includes("Drafts") &&
      !homeRes.body.includes("Publish Article"),
      "Homepage strictly has NO admin or write options visible"
    );

    // Check date restrictions
    const dateRegex = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/i;
    const readingTimeRegex = /\b\d+\s+min\s+read\b/i;
    assert(!dateRegex.test(homeRes.body), "Homepage strictly has NO publication dates");
    assert(!readingTimeRegex.test(homeRes.body), "Homepage strictly has NO reading times");

    // -----------------------------------------------------------------
    // TEST GROUP 2: ABOUT SECTION
    // -----------------------------------------------------------------
    console.log("\n--- Group 2: About Section ---");
    const aboutRes = await request("/about");
    assert(aboutRes.status === 200, "About page returns status 200");
    assert(aboutRes.body.includes("A Little About Me"), "About page contains exact heading 'A Little About Me'");
    assert(
      aboutRes.body.includes("undergraduate Computer Science student"),
      "About page mentions undergraduate Computer Science student"
    );
    assert(
      aboutRes.body.includes("I&#x27;m here to learn, question, explore, and occasionally put those thoughts into writing.") ||
      aboutRes.body.includes("I'm here to learn, question, explore, and occasionally put those thoughts into writing."),
      "About page contains exact concluding sentence"
    );
    assert(
      !aboutRes.body.toLowerCase().includes("cgpa") &&
      !aboutRes.body.toLowerCase().includes("gpa") &&
      !aboutRes.body.toLowerCase().includes("semester") &&
      !aboutRes.body.toLowerCase().includes("resume"),
      "About page has NO corporate résumé or unrequested academic details"
    );

    // -----------------------------------------------------------------
    // TEST GROUP 3: MY ARTICLES & INDIVIDUAL ARTICLE PAGE
    // -----------------------------------------------------------------
    console.log("\n--- Group 3: My Articles & Individual Reader ---");
    const articlesRes = await request("/articles");
    assert(articlesRes.status === 200, "My Articles returns status 200");
    assert(articlesRes.body.includes("My Articles"), "My Articles page has title");
    assert(!dateRegex.test(articlesRes.body), "My Articles strictly has NO dates or timestamps");
    assert(!readingTimeRegex.test(articlesRes.body), "My Articles strictly has NO reading times");

    // Direct URL access test
    const essaySlug = "even-when-i-lose-my-enthusiasm";
    const essayRes = await request(`/articles/${essaySlug}`);
    assert(essayRes.status === 200, `Direct access to /articles/${essaySlug} returns 200`);
    assert(essayRes.body.includes("Even When I Lose My Enthusiasm"), "Essay renders title");
    assert(essayRes.body.includes("Written by Hammad Azam"), "Essay renders 'Written by Hammad Azam'");
    assert(essayRes.body.includes("Back to My Articles"), "Essay has back link");
    assert(!dateRegex.test(essayRes.body), "Individual article strictly has NO publication dates");
    assert(!readingTimeRegex.test(essayRes.body), "Individual article strictly has NO reading times");

    // Non-existent slug test
    const missingRes = await request("/articles/non-existent-random-slug-999");
    assert(missingRes.status === 404, "Non-existent article returns 404");

    // -----------------------------------------------------------------
    // TEST GROUP 4: SECURITY & ACCESS CONTROL
    // -----------------------------------------------------------------
    console.log("\n--- Group 4: Security & Access Control ---");
    const unauthAdmin = await request("/admin");
    assert(
      unauthAdmin.status === 307 || unauthAdmin.status === 302 || unauthAdmin.status === 308,
      "Unauthorized access to /admin redirects to login"
    );

    const unauthScope = await request("/api/articles?scope=all");
    assert(unauthScope.status === 401, "GET /api/articles?scope=all without credentials returns 401 Unauthorized");

    const unauthPost = await request("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { title: "Hacked Article", content: "Should fail" },
    });
    assert(unauthPost.status === 401, "POST /api/articles without credentials returns 401 Unauthorized");

    // -----------------------------------------------------------------
    // TEST GROUP 5: AUTHENTICATION & ADMIN CRUD LIFECYCLE
    // -----------------------------------------------------------------
    console.log("\n--- Group 5: Authentication & Publishing Workflow ---");
    // Invalid login
    const badLogin = await request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: "hammad@journal.com", password: "wrong-password" },
    });
    assert(badLogin.status === 401, "Invalid password rejected with 401");

    // Valid login
    const goodLogin = await request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: "hammad@journal.com", password: "HammadJournal2026!" },
    });
    assert(goodLogin.status === 200, "Valid admin login returns 200");
    const cookieHeader = goodLogin.headers["set-cookie"];
    assert(Boolean(cookieHeader), "Login response returns Set-Cookie header");

    const authHeaders = {
      Cookie: Array.isArray(cookieHeader) ? cookieHeader.join("; ") : cookieHeader,
      "Content-Type": "application/json",
    };

    // 1. Create a Draft
    const draftPayload = {
      title: "Test Draft On Epistemic Humility",
      subtitle: "Why we should hold our models lightly.",
      content: "<p>This is a private draft created during automated verification testing.</p>",
      category: "Philosophy",
      status: "draft",
    };
    const createDraftRes = await request("/api/articles", {
      method: "POST",
      headers: authHeaders,
      body: draftPayload,
    });
    assert(createDraftRes.status === 201, "Create draft article returns 201 Created");
    const createdDraft = JSON.parse(createDraftRes.body);
    assert(createdDraft.status === "draft", "Created article has status 'draft'");

    // Verify draft is strictly NOT on public website
    const publicListCheck = await request("/articles");
    assert(
      !publicListCheck.body.includes("Test Draft On Epistemic Humility"),
      "Draft article is strictly INVISIBLE on public /articles page"
    );

    const publicSlugCheck = await request(`/articles/${createdDraft.slug}`);
    assert(
      publicSlugCheck.status === 404,
      "Direct URL to draft returns 404 for public visitors"
    );

    // 2. Publish the Draft
    const publishRes = await request(`/api/articles/${createdDraft.id}`, {
      method: "PUT",
      headers: authHeaders,
      body: { status: "published" },
    });
    assert(publishRes.status === 200, "Publish article via PUT returns 200");
    const publishedData = JSON.parse(publishRes.body);
    assert(publishedData.status === "published", "Article status updated to 'published'");

    // Verify it is now visible publicly
    const publicPublishedList = await request("/articles");
    assert(
      publicPublishedList.body.includes("Test Draft On Epistemic Humility"),
      "Published article is now visible on /articles"
    );

    const publicPublishedPage = await request(`/articles/${createdDraft.slug}`);
    assert(
      publicPublishedPage.status === 200,
      "Direct URL to newly published article returns 200"
    );
    assert(
      publicPublishedPage.body.includes("Test Draft On Epistemic Humility"),
      "Direct URL renders article content"
    );

    // 3. Edit the Published Article (Content update without duplicate creation)
    const updateRes = await request(`/api/articles/${createdDraft.id}`, {
      method: "PUT",
      headers: authHeaders,
      body: {
        title: "Test Draft On Epistemic Humility - Revised",
        subtitle: "Updated subtitle for verification.",
      },
    });
    assert(updateRes.status === 200, "Edit article returns 200");
    const updatedData = JSON.parse(updateRes.body);
    assert(
      updatedData.title === "Test Draft On Epistemic Humility - Revised",
      "Article title updated in database"
    );

    // 4. Unpublish the Article
    const unpublishRes = await request(`/api/articles/${createdDraft.id}`, {
      method: "PUT",
      headers: authHeaders,
      body: { status: "draft" },
    });
    assert(unpublishRes.status === 200, "Unpublish article returns 200");

    const afterUnpublishCheck = await request(`/articles/${createdDraft.slug}`);
    assert(
      afterUnpublishCheck.status === 404,
      "Unpublished article immediately returns 404 to public readers"
    );

    // 5. Delete the test article
    const deleteRes = await request(`/api/articles/${createdDraft.id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    assert(deleteRes.status === 200, "Delete article returns 200");

    // Verify deletion
    const afterDeleteList = await request("/api/articles?scope=all", {
      headers: authHeaders,
    });
    const allAfterDelete = JSON.parse(afterDeleteList.body);
    assert(
      !allAfterDelete.some((a) => a.id === createdDraft.id),
      "Article was completely removed from database"
    );

    // -----------------------------------------------------------------
    // TEST GROUP 6: SEO & ROBOTS
    // -----------------------------------------------------------------
    console.log("\n--- Group 6: SEO & Machine Discovery ---");
    const robotsRes = await request("/robots.txt");
    assert(robotsRes.status === 200, "/robots.txt returns 200");
    assert(robotsRes.body.includes("Disallow: /admin/"), "/robots.txt protects /admin/");

    const sitemapRes = await request("/sitemap.xml");
    assert(sitemapRes.status === 200, "/sitemap.xml returns 200");
    assert(sitemapRes.body.includes("/articles"), "/sitemap.xml includes article archive");

    console.log("\n=================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("=================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution exception:", err);
    process.exit(1);
  }
}

runTests();
