"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [expand, setExpand] = useState(false);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
      if (session?.accessToken) {
        try {
          const response = await fetch("https://api.github.com/user/repos?visibility=all", {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch repositories");
          }

          const data = await response.json();
          setRepos(data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [session]);

  if (loading) {
    return (
      <div className="lds-default h-full w-full bg-white text-black"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    )
  }

  return (
    <div className="min-h-screen w-screen bg-white text-black bg-gray-100 p-8 flex flex-col items-center">
      <header className="w-full flex justify-between items-center bg-blue-600 px-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {session ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4">
              {session.user.image && (
                <div className="flex justify-center items-center">
                  <Image
                    src={session.user.image}
                    onClick={() => setExpand(!expand)}
                    width={40}
                    height={40}
                    alt="Profile Picture"
                    className="rounded-full cursor-pointer border-2 border-blue-500"
                  />
                  <div className={`${expand ? "absolute" : "hidden"} w-28 text-[#323232] space-y-2 text-center mt-44 py-2 bg-[#fafafa] border border-[#1f1f1f] rounded-md`}>
                    <button
                      onClick={() => signOut()}
                      className="hover:text-red-600 transition duration-200"
                    >
                      Sign Out
                    </button>

                    <button
                      onClick={() => signOut()}
                      className="border-y border-black py-2 w-full hover:text-black transition duration-200"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => signOut()}
                      className="hover:text-black transition duration-200"
                    >
                      Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() => signIn()}
              className="px-4 py-2 bg-green-500 bg-cyan-500 hover:bg-cyan-600 text-white rounded hover:bg-green-600 transition duration-200"
            >
              Sign In
            </button>
          </div>
        )}
      </header>

      <div className="p-6">
        {(repos.length > 0 && session) && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Your GitHub Repositories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {repos.map((repo) => (
                <div key={repo.id} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-blue-600 text-lg mb-2">{repo.name}</h4>
                  <p className="text-gray-600 text-sm mb-4">{repo.description || "No description available"}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <p>⭐ {repo.stargazers_count}</p>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View on GitHub
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
