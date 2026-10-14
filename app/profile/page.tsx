import connectDb from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import profileDefault from "@/assets/images/profile.png";

const ProfilePage = async () => {
  // Auth check: if there is no logged-in user, send them to sign-in
  // and return them to /profile after login
  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    redirect("/api/auth/signin?callbackUrl=/profile");
  }

  // Connect to the database after the auth check
  await connectDb();

  return (
    <section className="bg-blue-50">
      <div className="container m-auto py-24">
        {/* Main profile card */}
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

          <div className="flex flex-col md:flex-row">
            {/* Left column: user avatar, name and email */}
            <div className="md:w-1/4 mx-20 mt-10">
              <div className="mb-4">
                <Image
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
                  src={sessionUser.user.image || profileDefault}
                  alt="User"
                  width={200}
                  height={200}
                />
              </div>

              <h2 className="text-2xl mb-4">
                <span className="font-bold block">Name: </span>
                {sessionUser.user.name}
              </h2>
              <h2 className="text-2xl">
                <span className="font-bold block">Email: </span>
                {sessionUser.user.email}
              </h2>
            </div>

            {/* Right column: user's listings (static placeholders for now) */}
            <div className="md:w-3/4 md:pl-4">
              <h2 className="text-xl font-semibold mb-4">Your Listings</h2>

              {/* Sample listing 1 - will be loaded from the database in the next lesson */}
              <div className="mb-10">
                <Link href="/properties/1">
                  <img
                    className="h-32 w-full rounded-md object-cover"
                    src="/images/properties/a1.jpg"
                    alt="Property 1"
                  />
                </Link>
                <div className="mt-2">
                  <p className="text-lg font-semibold">Property Title 1</p>
                  <p className="text-gray-600">Address: 123 Main St</p>
                </div>
                {/* Edit and delete actions */}
                <div className="mt-2">
                  <Link
                    href="/properties/edit/1"
                    className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Sample listing 2 */}
              <div className="mb-10">
                <Link href="/properties/2">
                  <img
                    className="h-32 w-full rounded-md object-cover"
                    src="/images/properties/b1.jpg"
                    alt="Property 2"
                  />
                </Link>
                <div className="mt-2">
                  <p className="text-lg font-semibold">Property Title 2</p>
                  <p className="text-gray-600">Address: 456 Elm St</p>
                </div>
                <div className="mt-2">
                  <Link
                    href="/properties/edit/2"
                    className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
