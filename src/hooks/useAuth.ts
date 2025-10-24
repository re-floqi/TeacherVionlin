import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseService';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = supabase.auth.session();
        setUser(session?.user ?? null);
        setLoading(false);

        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.unsubscribe();
        };
    }, []);

    const signIn = async (email, password) => {
        setLoading(true);
        const { user, error } = await supabase.auth.signIn({ email, password });
        setUser(user);
        setLoading(false);
        return { user, error };
    };

    const signOut = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return { error };
    };

    return { user, loading, signIn, signOut };
};

export default useAuth;