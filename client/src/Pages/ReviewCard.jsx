/* eslint-disable react/prop-types */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const ReviewCard = ({ review }) => {
  return (
    <Card className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 w-[280px]  flex flex-col ">
      <CardHeader className="flex flex-col gap-1 p-0">
        <CardTitle className="text-lg font-semibold text-gray-800 truncate">
          <Label>User : </Label>
          {review.username || "Anonymous"}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 p-0">
          Rating:{" "}
          <span className="text-yellow-500 font-bold">
            {review.rating || "N/A"} ★
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto mt-2 p-0">
        <Label>Comment</Label>
        <p className="text-gray-700 text-sm">
          {review.comment
            ? review.comment.slice(0, 100) +
              (review.comment.length > 100 ? "..." : "")
            : "Not reviewed yet."}
        </p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
