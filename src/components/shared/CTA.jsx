import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CTA = ({
    hasButton,
    isLeft,
    tagline,
    description,
    buttonText = "",
    image
}) => {
    return (
        <div className="max-w">
            {isLeft ? (
                <CTALeft
                    hasButton={hasButton}
                    tagline={tagline}
                    description={description}
                    buttonText={buttonText}
                    image={image}
                />
            ) : (
                <CTARight
                    hasButton={hasButton}
                    tagline={tagline}
                    description={description}
                    buttonText={buttonText}
                    image={image}
                />
            )}
        </div>
    );
};

export default CTA;

const CTALeft = ({ tagline, description, hasButton, buttonText, image }) => {
    const { setIsSignUp } = useAuth();
    return (
        <section className="cta-section overflow-hidden bg-gray-50 flex flex-col sm:flex-row">
            <div className="cta-image h-full w-full sm:h-full flex-1 bg-gray-300 flex items-center justify-center">
                {image ? (
                    <img 
                        src={image} 
                        alt=""
                        className="h-full w-full object-cover" // Maintain aspect ratio and cover vertically
                    />
                ) : (
                    <span className="text-gray-500 h-full">Image Placeholder</span>
                )}
            </div>
            <div className="cta-content p-8 md:p-12 lg:px-16 lg:py-24 flex-1">
                <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 md:text-3xl">
                        {tagline}
                    </h2>

                    <p className="hidden text-gray-500 md:mt-4 md:block">{description}</p>

                    {hasButton && (
                        <div className="mt-4 md:mt-8">
                            <Link
                                onClick={() => setIsSignUp(true)}
                                className="inline-block rounded bg-emerald-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring focus:ring-yellow-400"
                            >
                                {buttonText}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const CTARight = ({ tagline, description, hasButton, buttonText, image }) => {
    const { setIsSignUp } = useAuth();
    return (
        <section className="cta-section overflow-hidden bg-gray-50 flex flex-col sm:flex-row">
            <div className="cta-content p-8 md:p-12 lg:px-16 lg:py-24 flex-1">
                <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 md:text-3xl">
                        {tagline}
                    </h2>

                    <p className="hidden text-gray-500 md:mt-4 md:block">
                        {description}
                    </p>

                    {hasButton && (
                        <div className="mt-4 md:mt-8">
                            <Link
                                to="/login"
                                onClick={() => setIsSignUp(true)}
                                className="inline-block rounded bg-teal-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-teal-700 focus:outline-none focus:ring focus:ring-yellow-400"
                            >
                                {buttonText}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="cta-image h-full w-full sm:h-full flex-1 bg-gray-300 flex items-center justify-center">
                {image ? (
                    <img 
                        src={image} 
                        alt="" 
                        className="h-full w-full object-cover" // Force the image to fill the whole space
                    />
                ) : (
                    <span className="text-gray-500 h-full">Image Placeholder</span>
                )}
            </div>
        </section>
    );
};