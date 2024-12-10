import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Logo from '../../../assets/logo/logoLogin.png'
import Rectangle from '../../../assets/assetabout/Rectangle 645.png'
import Hand from '../../../assets/assetabout/Female hand holding iPhone 14 Pro.png'
import Screen from '../../../assets/assetabout/iPhone SE - 2.png'
import Frame1 from '../../../assets/assetabout/Frame 1.png' 
import Frame2 from '../../../assets/assetabout/Frame 2.png'
import Frame3 from '../../../assets/assetabout/Frame 3.png'
import Frame4 from '../../../assets/assetabout/Frame 4.png'

// Main LandingPage component
const About = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

<header className="bg-[#FAFAFAFA] shadow-md py-2 px-4">
  <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between mb-5">
    {/* Logo and Menu Combined */}
    <div className="flex flex-col items-center w-full sm:flex-row sm:justify-between"> {/* Center logo and adjust layout for smaller screens */}
      {/* Logo */}
      <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto mb-2 sm:mb-0">
        <img
          src={Logo}
          alt="PixelStore Logo"
          className="h-20 w-20 sm:h-20 sm:w-20 md:h-20 md:w-20 lg:h-20 lg:w-20 xl:h-20 xl:w-20" // Uniform size for md and larger screens
        />
      </div>
      {/* Menu and Button */}
      <div className="flex-grow flex justify-center sm:justify-end sm:mt-0">
      <nav className="flex items-center space-x-4 sm:space-x-10 mx-[-10px] ml-4 sm:ml-6 md:ml-8 lg:ml-10 xl:ml-12">
      <ul className="flex space-x-4 text-black font-poppins text-xs">
            <li>
              <Link to="/" className="hover:text-gray-500">Home</Link>
            </li>
            <li>
              <Link to="/assets" className="hover:text-gray-500">Assets</Link>
            </li>
            <li>
              <Link to="/testimonials" className="hover:text-gray-500">Testimonials</Link>
            </li>
          </ul>

          {/* Get the App Button */}
          <a
            href="/"
            className="bg-[#5282ED] text-xs text-white font-poppins py-1 px-1 sm:px-8 rounded ml-0 sm:ml-5" // Use responsive padding and margin
          >
            Get The App Web →
          </a>
        </nav>
      </div>
    </div>
  </div>
</header>
      <Body />
      <Footer />
    </>
  );
};

// Body component containing main content
const Body = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-[#FAFAFAFA] relative px-2 sm:px-4 md:px-8 lg:px-12 xl:px-16">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center w-full max-w-6xl mx-auto">
        {/* Left Section */}
        <div className="flex flex-col items-start space-y-3 md:w-1/2 mt-8 md:mt-0 px-4 lg:px-0 mr-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black ml-0">
            Your Creative Journey Start <br /> with <span className="text-blue-500">Pixel Store</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 ml-0">
            Empower Your Assets and Expand Your Reach!
          </p>
          <button className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 text-white bg-bl ue-500 rounded hover:bg-blue-600 flex items-center ml-0">
            <Link to="/login" className="flex items-center">Login Now → <span className="fas fa-arrow-right ml-2"></span></Link>
            </button>
        </div>

        {/* Right Section */}
        <div className="relative flex items-center justify-center mt-8 md:mt-0 md:w-1/2">
          {/* Background Circles */}
          <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-blue-100 rounded-full -z-10"></div>
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-blue-200 rounded-full -z-10"></div>

          {/* Image Section */}
          <div
            className="relative bg-gray-200 z-0 overflow-hidden"
            style={{
              width: "150%",
              maxWidth: "559px",
              height: "auto",
              aspectRatio: "559 / 583",
              borderTopLeftRadius: "270px",
              borderTopRightRadius: "270px",
            }}
          >
            {/* Background layer */}
            <img
              src={Rectangle}
              alt="Background image for hand holding phone"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Hand holding phone */}
            <img
              src={Hand}
              alt="Hand holding a phone"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                position: "relative",
                zIndex: 1,
                width: "80%",
                height: "107%",
                left: "23%",
                top: "5%",
              }}
            />
            {/* Content on phone screen */}
            <img
              src={Screen}
              alt="Phone screen content"
              className="absolute"
              style={{
                zIndex: 2,
                width: "84%",
                height: "119%",
                top: "-18%",
                left: "6%",
                padding: "25%",
              }}
            />
          </div>
        </div>
      </div>

{/* Features Section */}
<section className="text-center py-16">
  {/* Flex container for left and right sections */}
  <div className="flex flex-col md:flex-row justify-between items-start w-screen">
    
    {/* Left Section */}
    <div className="mb-5 pt-28 mt-12 text-left w-full md:w-[45%] px-6 md:px-10 md:ml-[-10px]"> 
      <h2 className="text-3xl font-bold">
        Discover the Benefits <br /> of <span className="text-[#5282ED]">Pixel Store</span>
      </h2>
      <p className="text-gray-600 mt-4">
        Empower Your Assets and Expand Your Reach!
      </p>
    </div>

    {/* Right Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:w-[55%] px-20">
      <FeatureBox
        iconSrc={Frame1}
        title="High-Quality Asset"
        description="Pixel Store offers a variety of visual assets, from photos and illustrations to 3D design elements."
        bgColor="bg-blue-500 text-white"
        roundedClass="rounded-tl"
        borderRadius={30}
        size={250}
      />
      <FeatureBox
        iconSrc={Frame2}
        title="Affordable Licensing"
        description="Select from a range of budget-friendly licensing options for personal or commercial use."
        bgColor="bg-white text-black"
        roundedClass="rounded-tr"
        borderRadius={30}
        size={250}
      />
      <FeatureBox
        iconSrc={Frame3}
        title="User-Friendly Interface"
        description="Pixel Store makes it easy to browse and download assets, ensuring a smooth user experience."
        bgColor="bg-white text-black"
        roundedClass="rounded-bl"
        borderRadius={30}
        size={250}
      />
      <FeatureBox
        iconSrc={Frame4}
        title="Collaborative Community"
        description="Share your work and gain valuable feedback to grow as an artist or creator."
        bgColor="bg-white text-black"
        roundedClass="rounded-br"
        borderRadius={30}
        size={250}
      />
    </div>
  </div>
</section>

<Reviews />
    </div>
  );
};

const FeatureBox = ({ iconSrc, title, description, bgColor, roundedClass, borderRadius, size }) => {
  const borderRadiusStyle = {
    borderTopLeftRadius: roundedClass === "rounded-tl" ? `${borderRadius}px` : "10px",
    borderTopRightRadius: roundedClass === "rounded-tr" ? `${borderRadius}px` : "10px",
    borderBottomLeftRadius: roundedClass === "rounded-bl" ? `${borderRadius}px` : "10px",
    borderBottomRightRadius: roundedClass === "rounded-br" ? `${borderRadius}px` : "10px",
  };

  return (
    <div
      className={`${bgColor} p-4 shadow-lg text-left`}
      style={{
        ...borderRadiusStyle,
        height: "280px", // Ensures equal height
        width: "150%",  // Adjusts for responsive grid
        maxWidth: "250px", // Limits max width
      }}
    >
      <img src={iconSrc} alt={`${title} icon`} className="w-12 h-12 mb-3 mx-auto" />
      <h3 className="text-xl font-bold text-center">{title}</h3>
      <p className="mt-2 p-1 text-justify text-sm sm:text-base md:text-sm lg:text-sm xl:text-lg">
        {description}
      </p>
    </div>
  );
};

// Reviews Component
const Reviews = () => {
  return (
    <section className="bg-[#5282ED] text-white py-16 px-10 w-screen">
      <div className="px-4 md:px-20">
        <h2 className="text-3xl font-bold text-center">What People Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-8 px-4 md:px-12 justify-items-center">
          <ReviewCard
            name="Glen Lynam"
            review="This app is awesome! It's like having a treasure map for all the coolest assets out there. I love how easy it is to find unique stuff and keep track of my favorite finds. Whether I'm browsing or buying, it makes everything super fun and simple. Can't imagine my shopping without it!"
            rating={5}
            profilePic="Photo 1.png"
            customMargin="md:mr-[-1px]"
          />
          <ReviewCard
            name="Olivia Maria"
            review="This app is a total game-changer! It’s like a playground for asset hunters. I can easily discover amazing deals and track my collections all in one place. It’s made shopping so much easier and way more enjoyable. Seriously, I can’t stop using it!"
            rating={5}
            profilePic="Photo 2.png"
            customMargin="md:ml-[-1px]"
          />
        </div>
      </div>
    </section>
  );
};

// ReviewCard Component
const ReviewCard = ({ name, review, rating, profilePic, customMargin }) => (
  <div className={`bg-white text-black p-10 sm:p-12 md:p-14 w-full sm:w-[95%] md:w-[90%] lg:w-[80%] xl:w-[75%] rounded-lg shadow-lg relative ${customMargin}`}>
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <img src={profilePic} alt={`Profile picture of ${name}`} className="rounded-full w-16 h-16 md:w-20 md:h-20" />
    </div>
    <p className="text-sm mt-16 md:mt-20 lg:mt-24 text-justify px-4">{review}</p>
    <div className="flex items-center justify-center mt-4">
      <span className="mr-1 text-yellow-400">{"★".repeat(rating)}</span>
      <span className="text-gray-500">{rating} stars</span>
    </div>
    <p className="font-bold mt-3 md:mt-5 text-center">{name}</p>
  </div>
);

export default About;