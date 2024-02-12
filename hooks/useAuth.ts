import React from "react";
import { AuthContext } from "./provider/AuthProvider";

// useAuth is a custom hook to consume the Credentials context
export const useAuth = () => {
    const context = React.useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
