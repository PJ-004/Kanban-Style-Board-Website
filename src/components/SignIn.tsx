import { useState } from "react";
import { supabase } from "../utils/supabase";

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: 'transparent',
    color: '#0070f3',
    border: '2px solid #0070f3',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

const SignIn = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAuth = async () => {
        setLoading(true);
        setError(null);

        const { error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

        if (error) setError(error.message);
        setLoading(false);
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInAnonymously();
        if (error) setError(error.message);
        setLoading(false);
    };

    return (
        <div>
        <div>
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ border: "2px solid black", padding: "8px", borderRadius: "4px" }}
            />
        </div>

        <div>
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ border: "2px solid black", padding: "8px", borderRadius: "4px" }}
            />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
            <button style={buttonStyle} disabled={loading} onClick={() => { setIsSignUp(false); handleAuth(); }}>
            Sign In
            </button>
        
            <button style={buttonStyle} disabled={loading} onClick={() => { setIsSignUp(true); handleAuth(); }}>
            Sign Up
            </button>
        
            <button style={buttonStyle} disabled={loading} onClick={handleGuestLogin}>
            Guest Login
            </button>
        </div>
        </div>
    );
};

export default SignIn;