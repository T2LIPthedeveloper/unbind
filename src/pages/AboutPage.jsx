import React from 'react';

const AboutPage = () => {
  return (
    <div className="about-page p-4 sm:p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white border-solid border-teal-600 border-4 rounded-lg overflow-hidden mb-8">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-2 sm:mb-4">
            About Unbind
          </h1>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-serif">
            Unbind is designed to revolutionize the way you engage with books. Our mission is to empower readers by providing a comprehensive platform that caters to all their reading needs. Whether you're an avid reader or just getting started, Unbind offers tools to track your reading progress, discover new books, and connect with a community of like-minded individuals.
          </p>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-serif">
            At Unbind, we believe that reading should be a seamless and enjoyable experience. Our platform allows you to easily organize your book collection, create personalized reading lists, and set reading goals. With Unbind, you can explore new genres, find recommendations based on your interests, and share your thoughts with fellow readers.
          </p>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-serif">
            Join Unbind today and become part of a vibrant community that celebrates the joy of reading. Our platform is completely free, and we are committed to continuously improving and expanding our features to better serve our users. Unleash your reading potential with Unbind and discover a world of endless possibilities.
          </p>
        </div>
      </div>
      <div className="max-w-4xl w-full bg-white border-solid border-teal-600 border-4 rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-teal-600 mb-2 sm:mb-4">
            About the Creator
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-serif">
            Unbind was created by Atul Parida, a passionate developer with a love for reading and open-source projects. Atul is dedicated to building tools that enhance productivity and bring communities together. You can learn more about Atul and his work on his <a href="https://www.linkedin.com/in/atulparida" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline hover:text-teal-600">LinkedIn</a> or <a href="https://www.github.com/T2LIPthedeveloper" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline hover:text-teal-600">GitHub</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;