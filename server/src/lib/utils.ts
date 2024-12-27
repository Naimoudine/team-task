import { ObjectId } from "mongodb";
import { Conversation } from "../modules/conversations/conversationController";

export function validateConversationAccess(
  conversation: Conversation,
  userId: ObjectId
): boolean {
  return conversation.user1.equals(userId) || conversation.user2.equals(userId);
}

export function getReceiverId(
  conversation: Conversation,
  senderId: ObjectId
): ObjectId {
  return conversation.user1.equals(senderId)
    ? conversation.user2
    : conversation.user1;
}
