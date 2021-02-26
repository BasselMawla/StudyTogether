const database = require("./database");

let rooms = [];

// Initialize rooms into rooms array
async function createRoomsFromDB() {
  try {
    let result = await database.queryPromise(
      "SELECT institution_code, course_code " +
        "FROM institution as inst, course " +
        "WHERE inst.institution_id = course.institution_id"
    );

    result.forEach((row) => {
      const room = {
        roomId:
          row.institution_code.toLowerCase() +
          "_" +
          row.course_code.toLowerCase(),
        users: []
      };

      rooms.push(room);
    });
  } catch (err) {
    throw err;
  }
}

function joinRoom(newUser, roomId) {
  const room = getRoom(roomId);

  if (room) {
    // Check if user is already in the room
    if (!room.users.find((user) => user.peerId === newUser.peerId)) {
      room.users.push(newUser);
    }
  }
}

function leaveRoom(roomId, socketId) {
  const room = getRoom(roomId);
  if (room) {
    const index = room.users.findIndex((user) => user.socketId === socketId);
    if (index !== -1) {
      const disconnectedUser = room.users.splice(index, 1)[0];
      return disconnectedUser.peerId;
    }
  }
  console.log("getRoomFirstNames:");
  console.log(getRoomFirstNames(roomId));
}

function getRoomFirstNames(roomId) {
  let users = getRoomUsers(roomId);
  let firstNames = users.map((user) => {
    return user.firstName;
  });
  return firstNames;
}

// Get room users as an array of user objects
function getRoomUsers(roomId) {
  const room = getRoom(roomId);
  return room.users;
}

function getRoom(roomId) {
  return rooms.find((room) => room.roomId === roomId);
}

module.exports = {
  createRoomsFromDB,
  joinRoom,
  leaveRoom,
  getRoomFirstNames,
  getRoomUsers
};
