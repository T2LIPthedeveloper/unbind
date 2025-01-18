import React, { useState } from "react";

const FAQPage = () => {
  const faqData = [
    {
      question: "What is Unbind?",
      answer:
        "Unbind is your all-in-one reading companion. Track your books, discover new reads, and connect with other book lovers seamlessly.",
    },
    {
      question: "Is Unbind free to use?",
      answer:
        "Yes! Unbind is completely free. You can sign up today and enjoy all the features at no cost.",
    },
    {
      question: "How can I track my reading progress?",
      answer:
        "You can add books to your 'Currently Reading' section, update your progress, and even move them to 'Completed' once finished.",
    },
    {
      question: "Can I get book recommendations?",
      answer:
        "Absolutely! Unbind uses your reading history and ratings to recommend books you'll love.",
    },
    {
      question: "How do I see what others are reading?",
      answer:
        "You can explore the 'Trending Books Today' section to discover popular reads and see what’s capturing attention across the community.",
    },
    {
      question: "How do I report an issue or suggest a feature?",
      answer:
        "We’d love to hear from you! Head over to the 'Contact Us' section to share your feedback or report any issues.",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center w-full py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex flex-col lg:flex-row w-full h-full">
        <div className="flex flex-col w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-6 md:p-8 mt-8 lg:mt-0 lg:mr-4 flex-grow overflow-auto">
          <h1 className="text-3xl font-serif font-bold text-teal-600 text-center mb-6">
            Frequently Asked Questions
          </h1>
          <div className="space-y-6">
            {faqData.map((item, index) => (
              <div key={index} className="group">
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-teal-600 cursor-pointer">
                  {item.question}
                </h2>
                <p className="text-gray-700 mt-2 pl-4 border-l-4 border-teal-500">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-6 md:p-8 mt-8 lg:mt-0 lg:ml-4 flex-grow overflow-auto">
          <h2 className="text-3xl font-serif font-bold text-teal-600 text-center mb-6">
            Contact Us
          </h2>
          <p className="text-gray-700 mb-6 text-center">
            Have a question, suggestion, or just want to say hi?
          </p>
          <p className="text-gray-700 text-center h-full">
            Drop us a message and we'll get back to you as soon as possible.
          </p>
          <form
            action="https://formsubmit.co/92f8a813c09d1fccf77bf2a1d97f9dc4"
            method="POST"
            className="space-y-6 flex-grow"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>
            <div className="flex-grow">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                rows="10"
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full h-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm h-full"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
