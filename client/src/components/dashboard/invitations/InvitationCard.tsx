import React from "react";

type Props = {
  received: boolean;
  firstname: string;
  lastname: string;
  email: string;
  status: string;
  isPending: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
};

export default function InvitationCard({
  received,
  firstname,
  lastname,
  email,
  status,
  isPending,
  onAccept,
  onReject,
  onCancel,
}: Props) {
  return (
    <div className="flex items-center justify-between p-4 border-2 rounded-lg bg-zinc-100/20 border-zinc-200">
      <article className="flex items-center gap-6">
        {received ? (
          <p className="text-xs text-zinc-600">Received</p>
        ) : (
          <p className="text-xs text-zinc-600">Sent</p>
        )}
        <h2 className="font-medium">
          {firstname} {lastname}
        </h2>
        <p className="text-sm">{email}</p>
        <span
          className={
            status === "accepted"
              ? "p-1 text-xs rounded-lg bg-green-200"
              : status === "rejected"
              ? "p-1 text-xs rounded-lg bg-red-200"
              : "p-1 text-xs rounded-lg bg-zinc-200"
          }
        >
          {status}
        </span>
      </article>
      {isPending ? (
        onAccept && onReject ? (
          <div className="flex items-center gap-4">
            <button
              className="px-4 py-1 text-xs font-medium text-white bg-black rounded-lg hover:bg-black/70"
              onClick={onAccept}
            >
              Accept
            </button>
            <button
              className="px-4 py-1 text-xs font-medium text-white bg-black rounded-lg hover:bg-black/70"
              onClick={onReject}
            >
              Reject
            </button>
          </div>
        ) : (
          <button
            className="px-4 py-1 text-xs rounded-lg bg-zinc-200 hover:bg-zinc-200/70"
            onClick={onCancel}
          >
            Cancel
          </button>
        )
      ) : null}
    </div>
  );
}
