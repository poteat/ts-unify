import type { CommentNode, CommentKind, JsdocTag } from "./comment-node";
import { assertType } from "@/test-utils/assert-type";

describe("CommentNode", () => {
  it("is discriminated by type 'Comment'", () => {
    assertType<CommentNode["type"], "Comment">(0);
  });

  it("has three kinds", () => {
    assertType<CommentKind, "line" | "block" | "jsdoc">(0);
  });

  it("carries jsdoc parts as arrays", () => {
    assertType<CommentNode["lines"], string[]>(0);
    assertType<CommentNode["summary"], string[]>(0);
    assertType<CommentNode["body"], string[]>(0);
    assertType<CommentNode["tags"], JsdocTag[]>(0);
  });
});
