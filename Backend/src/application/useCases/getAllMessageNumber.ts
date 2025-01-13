import mongoose, { Types } from "mongoose";
import { chatModel } from "../../Infrastructure/db/chatModel";
import { messageModel } from "../../Infrastructure/db/messageModel";

export async function getAllMessageNumber(id:unknown){
    if(typeof id==='string'){
        try {
          const unreadMessages = await messageModel.aggregate([
            {
              $match: {
                senderId:new Types.ObjectId (id), 
                viewedList: false 
              }
            },
            {
              $group: {
                _id: "$chatId",
                unreadCount: { $sum: 1 }
              }
            },
            {
              $lookup: {
                from: "chats", 
                localField: "_id",
                foreignField: "_id",
                as: "chatRoom"
              }
            },
            {
              $unwind: "$chatRoom"
            },
            {
              $project: {
                _id: 0,
                otherUserId: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$chatRoom.members",
                        as: "member",
                        cond: { $ne: ["$$member", id] }
                      }
                    },
                    0
                  ]
                },
                unreadCount: 1
              }
            }
          ]);
          console.log(unreadMessages)
          return []
          } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch unread messages for matched users');
          }
    }
}