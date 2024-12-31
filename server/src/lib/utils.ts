import { ObjectId } from "mongodb";
import { Conversation } from "../modules/conversations/conversationController";

export function validateConversationAccess(
  conversation: Conversation,
  userId: ObjectId
): boolean {
  return (
    conversation.creator.equals(userId) ||
    conversation.correspondent.equals(userId)
  );
}
