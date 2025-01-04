import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSignUp, setIsSignUp] = useState(false); 

    useEffect(() => {
        const fetchSession = async () => {
            const { data: session } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);

            const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            });

            return () => {
                authListener.unsubscribe();
            };
        };

        fetchSession();
    }, []);
    
    const signIn = async (email, password) => {
        const { user, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(user);
        //
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
    };

    const signUp = async(email, password, firstName, lastName) => {
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                }
            }
        });
        if (error) throw error;
        setIsSignUp(false); // Reset isSignUp after successful signup
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            signIn, 
            signOut, 
            signUp, 
            isSignUp, 
            setIsSignUp 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};