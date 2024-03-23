const supertest = require("supertest");
const app = require("../../app");
const crypto = require("crypto");

const api = supertest(app);

// Constants
const PROFILE_END_POINT = "/profiles";
const USER_END_POINT = "/users";
const COMMENT_END_POINT = "/comments";

const INVALID_PROFILE_ID = "invalidProfileId";
const INVALID_USER_ID = "invalidUserId";
const INVALID_COMMENT_ID = "invalidCommentId";

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

const commentData = {
  text: "this my 1",
  user: "salman",
  personalitySystem: "enneagram",
  votes: [
    {
      system: "MBTI",
      value: "INTP",
    },
    {
      system: "Enneagram",
      value: "1w2",
    },
    {
      system: "Zodiac",
      value: "Virgo",
    },
  ],
};

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

async function newCommentCreate(profileId) {
  return api.post(`/${profileId}${COMMENT_END_POINT}`).send(commentData);
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

describe("Comment API Testing with Supertest", () => {
  // Comment creation test
  it("should create a new comment and retrieve it", async () => {
    //create profile
    const profileCreateResponse = await newProfileCreate();
    const profileId = profileCreateResponse.body._id;

    // Create a new comment
    const createResponse = await newCommentCreate(profileId);
    expect(createResponse.status).toEqual(201);

    // Check response body contains the created comment's data
    expect(createResponse.body.text).toEqual(commentData.text);

    // Retrieve the created comment
    const retrieveResponse = await api.get(
      `/${profileId}${COMMENT_END_POINT}?personalitySystem=ALL`
    );
    expect(retrieveResponse.status).toEqual(200);
    expect(retrieveResponse.body[0].user).toEqual(commentData.user);

    // invalid profile check
    const invalidProfileResponse = await api.get(
      `/${INVALID_PROFILE_ID}${COMMENT_END_POINT}?personalitySystem=ALL`
    );
    expect(invalidProfileResponse.status).toEqual(400);

    // unknown profile check
    const unknownProfileResponse = await api.get(
      `/${generateRandomString(12)}${COMMENT_END_POINT}?personalitySystem=ALL`
    );
    expect(unknownProfileResponse.status).toEqual(404);
  });

  describe("Comment like Testing with Supertest", () => {
    // comment like test
    it("should like and unlike a comment", async () => {
      const newProfileCreateResponse = await newProfileCreate();
      const newProfileId = newProfileCreateResponse.body._id;
      const newUserCreateResponse = await newUserCreate();
      const newUserId = newUserCreateResponse.body._id;
      await newCommentCreate(newProfileId);
      const retrieveCreatedCommentResponse = await api.get(
        `/${newProfileId}${COMMENT_END_POINT}?personalitySystem=ALL`
      );
      const commentId = retrieveCreatedCommentResponse.body[0]._id;
      const commentLikeResponse = await api.get(
        `/${newProfileId}${COMMENT_END_POINT}/${commentId}/toggleLike/${newUserId}`
      );

      console.log(commentLikeResponse.body.comments[0]?.likes);
      expect(
        commentLikeResponse.body.comments[0]?.likes.includes(newUserId)
      ).toEqual(true);

      // unlike comment
      const commentUnlikeResponse = await api.get(
        `/${newProfileId}${COMMENT_END_POINT}/${commentId}/toggleLike/${newUserId}`
      );

      console.log(commentUnlikeResponse.body.comments[0]?.likes);
      expect(
        commentUnlikeResponse.body.comments[0]?.likes.includes(newUserId)
      ).toEqual(false);

      // invalid profile id test
      const invalidProfileIdResponse = await api.get(
        `/${INVALID_PROFILE_ID}${COMMENT_END_POINT}/${commentId}/toggleLike/${newUserId}`
      );

      expect(invalidProfileIdResponse.status).toEqual(400);

      // unknown profile id test
      const unknownProfileIdResponse = await api.get(
        `/${generateRandomString(
          12
        )}${COMMENT_END_POINT}/${commentId}/toggleLike/${newUserId}`
      );

      expect(unknownProfileIdResponse.status).toEqual(404);

      // invalid comment id test
      const invalidCommentIdResponse = await api.get(
        `/${newProfileId}${COMMENT_END_POINT}/${INVALID_COMMENT_ID}/toggleLike/${newUserId}`
      );

      expect(invalidCommentIdResponse.status).toEqual(400);

      // unknown comment id test
      const unknownCommentIdResponse = await api.get(
        `/${newProfileId}${COMMENT_END_POINT}/${generateRandomString(
          12
        )}/toggleLike/${newUserId}`
      );

      expect(unknownCommentIdResponse.status).toEqual(404);

      // invalid user id test
      const invalidUserIdResponse = await api.get(
        `/${newProfileId}${COMMENT_END_POINT}/${commentId}/toggleLike/${INVALID_USER_ID}`
      );

      expect(invalidUserIdResponse.status).toEqual(400);

      // unknown user id test
      const unknownUserIdResponse = await api.get(
        `/${newProfileId}${COMMENT_END_POINT}/${commentId}/toggleLike/${generateRandomString(
          12
        )}`
      );

      expect(unknownUserIdResponse.status).toEqual(404);
    });
  });
});
