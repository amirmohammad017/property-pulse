import connectDb from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import Image from "next/image";
import { redirect } from "next/navigation";
import profileDefault from "@/assets/images/profile.png";
import Property from "@/models/Property";

import ProfileProperties from "../components/ProfilePropertie";

const ProfilePage = async () => {
  // Auth check: if there is no logged-in user, send them to sign-in
  // and return them to /profile after login
  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    redirect("/api/auth/signin?callbackUrl=/profile");
  }

  // Connect to the database after the auth check
  await connectDb();
  const rawProperties = await Property.find({
    owner: sessionUser.userId,
  })
    .sort({ createdAt: -1 })
    .lean();
  const properties = rawProperties.map((p) => ({
    ...p,
    _id: p._id.toString(),
    owner: p.owner.toString(),
  }));
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

              {/* listing property */}

              <ProfileProperties properties={properties} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
