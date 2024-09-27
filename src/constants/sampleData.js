export const sampleChats = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "pravit naik",
    _id: "1",
    groupChat: false,
    members: ["1", "2", "3"],
  },

  {
    avatar: [
      "https://tse1.mm.bing.net/th?id=OIP.ry0FnYNVVc6OOFGJhoPRKAHaI0&pid=Api&rs=1&c=1&qlt=95&w=92&h=109",
    ],
    name: "Shree Ram",
    _id: "2",
    groupChat: false,
    members: ["1", "2"],
  },

  {
    avatar: [
      "https://www.w3schools.com/howto/img_avatar.png",
      "https://tse1.mm.bing.net/th?id=OIP.wBMp4cKdcuUYNQpa332M1QHaHl&pid=Api&rs=1&c=1&qlt=95&w=119&h=122",
      "https://tse1.mm.bing.net/th?id=OIP.ry0FnYNVVc6OOFGJhoPRKAHaI0&pid=Api&rs=1&c=1&qlt=95&w=92&h=109",
    ],
    name: "Shree Krishna",
    _id: "3",
    groupChat: true,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "pravit naik",
    _id: "1",
  },
  {
    avatar: [
      "https://tse1.mm.bing.net/th?id=OIP.ry0FnYNVVc6OOFGJhoPRKAHaI0&pid=Api&rs=1&c=1&qlt=95&w=92&h=109",
    ],
    name: "Shree Ram",
    _id: "2",
  },
  {
    avatar: [
      "https://tse1.mm.bing.net/th?id=OIP.wBMp4cKdcuUYNQpa332M1QHaHl&pid=Api&rs=1&c=1&qlt=95&w=119&h=122",
    ],
    name: "Shree Krishna",
    _id: "3",
  },
];

export const sampleNotifications = [
  {
    sender: {
      name: "Pravit Naik",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
    },
    _id: "1",
  },
  {
    sender: {
      name: "Shree Ram",
      avatar:
        "https://tse1.mm.bing.net/th?id=OIP.ry0FnYNVVc6OOFGJhoPRKAHaI0&pid=Api&rs=1&c=1&qlt=95&w=92&h=109",
    },
    _id: "2",
  },

  {
    sender: {
      name: "Shree Krishna",
      avatar:
        "https://tse1.mm.bing.net/th?id=OIP.wBMp4cKdcuUYNQpa332M1QHaHl&pid=Api&rs=1&c=1&qlt=95&w=119&h=122",
    },
    _id: "3",
  },
];

export const sampleMessage = [
  {
    attachments: [],
    content: "Hey this is Pravit Naik",
    _id: "djfhouihg",
    sender: {
      _id: "user_id",
      name: "Pravit",
    },
    chat: "chatid",
    createdAt: "2024-05-02T10:41:30.6302",
  },

  {
    attachments: [
      {
        public_id: "abcde",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "",
    _id: "user2",
    sender: {
      _id: "rafce",
      name: "Rohit",
    },
    chat: "chatid",
    createdAt: "2024-05-02T10:41:30.6302",
  },

  {
    attachments: [
      {
        public_id: "johncena",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "Hey this is John Cina",
    _id: "user3",
    sender: {
      _id: "rafce",
      name: "John",
    },
    chat: "chatid",
    createdAt: "2024-05-02T10:41:30.6302",
  },
];

export const dashboradData = {
  users: [
    {
      name: "Pravit",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "1",
      username: "pravitnaik",
      friends: 20,
      groups: 5,
    },
    {
      name: "Rohit",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "2",
      username: "rohitjain",
      friends: 13,
      groups: 3,
    },
    {
      name: "Shaun",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "3",
      username: "shaunpeirera",
      friends: 25,
      groups: 8,
    },
  ],

  chats: [
    {
      name: "Local Group",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "1",
      groupChat: false,
      members: [
        { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      ],
      totalmembers: 2,
      totalMessages: 23,
      creator: {
        name: "Rohit",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },

    {
      name: "Professional Group",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "2",
      groupChat: false,
      members: [
        { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "3", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "4", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      ],
      totalmembers: 4,
      totalMessages: 43,
      creator: {
        name: "Pravit",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },

    {
      name: "Spriritual Group",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "3",
      username: "shaunpeirera",
      groupChat: true,
      members: [
        { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "3", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "4", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "5", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "6", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      ],
      totalmembers: 6,
      totalMessages: 73,
      creator: {
        name: "Shree Ram",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
  ],

  messages: [
    {
      attachments: [],
      content: "Hey this is Pravit Naik",
      _id: "djfhouihg",
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        _id: "user._id",
        name: "Pravit",
      },
      chat: "chatid",
      groupsChat: false,
      createdAt: "2024-05-02T10:41:30.6302",
    },

    {
      attachments: [
        {
          public_id: "abcde",
          url: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],
      content: "Hello there",
      _id: "user2",
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        _id: "rafce",
        name: "Rohit",
      },
      chat: "chatid",
      groupsChat: true,
      createdAt: "2024-05-02T10:41:30.6302",
    },

    {
      attachments: [
        {
          public_id: "johncena",
          url: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],
      content: "Hey this is John Cina",
      _id: "user3",
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        _id: "john",
        name: "John",
      },
      chat: "chatid",
      createdAt: "2024-05-02T10:41:30.6302",
    },
  ],
};
