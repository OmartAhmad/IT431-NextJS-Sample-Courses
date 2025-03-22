import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// Removed ObjectId import since we will use numeric IDs

// GET: Retrieve a single course by numeric ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: "Missing course ID." },
        { status: 400 }
      );
    }
    const courseId = Number(params.id); // Convert the id param to a number
    if (Number.isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID format." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("coursesDb");
    const course = await db.collection("courses").findOne({ id: courseId }); // lookup by numeric id

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error retrieving course:", error);
    return NextResponse.json(
      { error: "Failed to retrieve course." },
      { status: 500 }
    );
  }
}

// PUT: Update a course by numeric ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: "Missing course ID." },
        { status: 400 }
      );
    }
    const courseId = Number(params.id);
    if (Number.isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID format." },
        { status: 400 }
      );
    }

    const updatedCourse = await request.json();
    const client = await clientPromise;
    const db = client.db("coursesDb");
    const result = await db
      .collection("courses")
      .updateOne({ id: courseId }, { $set: updatedCourse });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Course updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a course by numeric ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: "Missing course ID." },
        { status: 400 }
      );
    }
    const courseId = Number(params.id);
    if (Number.isNaN(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID format." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("coursesDb");
    const result = await db.collection("courses").deleteOne({ id: courseId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: `Course with ID ${courseId} deleted.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course." },
      { status: 500 }
    );
  }
}
