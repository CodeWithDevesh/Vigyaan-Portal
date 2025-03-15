import iiIcon from "../../assets/Images/innovative-ideas.png";
import cIcon from "../../assets/Images/collaboration.png";
import lIcon from "../../assets/Images/launch.png";
import rIcon from "../../assets/Images/research.png";
import { Link } from "react-router";

function Home() {
  return (
    <div className="min-h-[80vh] w-screen mt-[80px] bg-gray-100 flex flex-col items-center text-center p-6">
      <header className="w-full max-w-4xl mb-8">
        <h1 className="text-5xl font-bold font-rubik underline text-primary">
          Vigyaan Portal
        </h1>
        <p className="text-lg text-gray-700 mt-2">
          The Official Platform for Innovation at NIT Raipur
        </p>
      </header>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Innovative Ideas Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-4">
          <div className="text-blue-500 w-[70px] h-[70px]">
            <img
              src={iiIcon}
              alt="Innovative Ideas"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Innovative Ideas
            </h2>
            <p className="text-gray-700 text-base">
              Discover groundbreaking tech innovations from talented students
              and researchers.
            </p>
          </div>
        </div>

        {/* Collaboration Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-4">
          <div className="text-blue-500 w-[70px] h-[70px]">
            <img
              src={cIcon}
              alt="Collaboration"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Collaboration
            </h2>
            <p className="text-gray-700 text-base">
              Connect with like-minded innovators and work together on exciting
              projects.
            </p>
          </div>
        </div>

        {/* Research & Development Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-4">
          <div className="text-blue-500 w-[70px] h-[70px]">
            <img src={rIcon} alt="Research & Development" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Research &amp; Development
            </h2>
            <p className="text-gray-700 text-base">
              Access resources and support for your tech research and
              development projects.
            </p>
          </div>
        </div>

        {/* Launch Your Project Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-4">
          <div className="text-blue-500 w-[70px] h-[70px]">
            <img src={lIcon} alt="Launch Your Project" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Launch Your Project
            </h2>
            <p className="text-gray-700 text-base">
              Take your innovation from concept to reality with our
              comprehensive platform.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link
          to="/projects"
          className="bg-blue-600 inline-block text-white px-6 py-3 rounded-2xl text-lg font-medium hover:bg-blue-700 active:scale-90 transition"
        >
          🚀 Browse Projects
        </Link>
      </div>
    </div>
  );
}

export default Home;
