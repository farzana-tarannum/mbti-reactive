const supertest = require("supertest");
const app = require("../../app");
const crypto = require("crypto");

const api = supertest(app);

// Constants
const PROFILE_END_POINT = "/profiles";
const INVALID_PROFILE_ID = "invalidProfileId";
const USER_END_POINT = "/users";
const INVALID_USER_ID = "invalidUserId";

const newProfile = {
  name: "John Doe",
  description: "Adolph Larrue Martinez III.",
  mbti: "ISFJ",
  enneagram: "9w3",
  variant: "sp/so",
  tritype: 725,
  socionics: "SEE",
  sloan: "RCOEN",
  psyche: "FEVL",
  image: "https://soulverse.boo.world/images/1.png",
};

const userData = { name: "John Doe" };

// Helper function to generate random string
function generateRandomString(length) {
  return crypto.randomBytes(length).toString("hex");
}

async function newProfileCreate() {
  return api.post(PROFILE_END_POINT).send(newProfile);
}

async function newUserCreate() {
  return api.post(USER_END_POINT).send(userData);
}

describe("Profile API Testing with Supertest", () => {
  // Profile creation test
  it("should create a new profile and retrieve it", async () => {
    let profileId;

    // Create a new profile
    const createResponse = await newProfileCreate();
    expect(createResponse.status).toEqual(201);
    expect(createResponse.body.name).toEqual(newProfile.name);
    expect(createResponse.body).toHaveProperty("_id");

    profileId = createResponse.body._id;

    // Retrieve the created profile
    console.log("Fetched profileId: " + profileId);
    const retrieveResponse = await api.get(`${PROFILE_END_POINT}/${profileId}`);
    expect(retrieveResponse.status).toEqual(200);

    // Invalid profile ID
    const invalidProfileResponse = await api.get(
      `${PROFILE_END_POINT}/${INVALID_PROFILE_ID}`
    );
    expect(invalidProfileResponse.status).toEqual(400);

    // Unknown profile ID check
    const unknownProfileResponse = await api.get(
      `${PROFILE_END_POINT}/${generateRandomString(12)}`
    );
    expect(unknownProfileResponse.status).toEqual(404);
  });
});

describe("User API Testing with Supertest", () => {
  // User creation test
  it("should create a new user and retrieve it", async () => {
    let userId;

    // Create a new user
    const createResponse = await newUserCreate();
    expect(createResponse.status).toEqual(201);

    // Check response body contains the created user's data
    expect(createResponse.body).toHaveProperty("_id");
    expect(createResponse.body.name).toEqual(userData.name);

    userId = createResponse.body._id;

    // Retrieve the created user
    console.log("Fetched userId: " + userId);
    const retrieveResponse = await api.get(`${USER_END_POINT}/${userId}`);
    expect(retrieveResponse.status).toEqual(200);

    // Invalid user ID
    const invalidUserResponse = await api.get(
      `${USER_END_POINT}/${INVALID_USER_ID}`
    );
    expect(invalidUserResponse.status).toEqual(400);

    // Unknown user ID check
    const unknownUserResponse = await api.get(
      `${USER_END_POINT}/${generateRandomString(12)}`
    );
    expect(unknownUserResponse.status).toEqual(404);
  });
});
