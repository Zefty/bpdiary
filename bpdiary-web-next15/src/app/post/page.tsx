"use client";

import { api } from "~/trpc/react";

export default function Post() {
    const post = api.session.validate.useQuery( {sessionToken: "123"} ).data;
    return (
        <div>
            Post peen {post}
        </div>
    )
}