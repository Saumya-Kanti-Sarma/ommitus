"use client";
export default function Login() {
  return (
    <main className="flex h-screen w-screen">
      {/* Left Aside */}
      <aside className="flex-1 bg-[var(--blue)] text-white flex flex-col justify-center items-center p-12 space-y-4">
        <img src="/logo/ommitus-main-menu.svg" alt="logo.svg" className="w-[200px]" />
        <h1 className="text-9xl font-extrabold tracking-wider text-[var(--white)]">OMMITUS</h1>
        <div className="flex flex-col">
          <h3 className="text-4xl font-semibold m-0">WELCOME TO <b>OMMITUS MANAGEMENT</b></h3>
          <p className="text-4xl italic m-0">The best RMS provider in India...</p>
        </div>
      </aside>

      {/* Right Form Section */}
      <div className="flex-1 bg-[var(--white)] flex flex-col justify-center px-20 py-12 ">
        <h1 className=" text-center text-4xl text-[var(--blue)] font-bold my-5">Register Your Restaurant With Us...</h1>
        <form className="bg-[var(--blue)] shadow-md rounded-xl p-10 space-y-6 w-[cal(100% - 10px)]max-w-[1000px]">
          {/* Restaurant Name */}
          <div>
            <label className="block mb-2 font-semibold text-[var(--white)]">Name of restaurant</label>
            <input
              type="text"
              name="restaurantName"
              placeholder="Enter the name of your restaurant"
              className="w-full border border-[var(--gray)] p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
            />
          </div>

          {/* Owner Name */}
          <div>
            <label className="block mb-2 font-semibold text-[var(--white)]">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              placeholder="Enter the name of restaurant owner"
              className="w-full border border-[var(--gray)] p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
            />
          </div>

          {/* Email with Verify Button */}
          <div>
            <label className="block mb-2 font-semibold text-[var(--white)]">Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter the email id"
                className="flex-1 border border-[var(--gray)] p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                onChange={(e) => {
                  const btn = document.getElementById("verifyBtn");
                  if (btn) btn.style.display = e.target.value.includes(".com") ? "block" : "none";
                }}
              />
              <button
                id="verifyBtn"
                type="button"
                className="bg-[var(--green)] px-4 py-2 rounded-md text-white hidden"
              >
                Verify
              </button>
            </div>
          </div>

          {/* Password with Eye Icon */}
          <div>
            <label className="block mb-2 font-semibold text-[var(--white)]">Password</label>
            <div className="flex items-center border border-[var(--gray)] rounded-md bg-white">
              <input
                type="password"
                name="password"
                placeholder="•••••"
                className="flex-1 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
              />
              <button type="button" className="p-2">
                <img src="/icons/eye.svg" alt="password-icon" className="w-5 h-5" />
              </button>
            </div>
          </div>
          <br />
          <button className="bg-white w-full p-3 rounded-md">Create Account</button>
        </form>
        <p className="text-center mt-1">Already have Account? <button className="text-[var(--red)]"> click here to Login</button></p>
        <button className="w-[cal(100% - 10px)]max-w-[1000px] p-4 rounded-2xl bg-[var(--blue)] text-white mt-10 text-2xl font-medium">Watch a tutorial</button>
      </div>
    </main>
  );
}
