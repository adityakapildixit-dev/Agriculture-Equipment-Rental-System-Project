import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { loginUser } from "../../services/authService";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await loginUser(username, password);

            login(response);

            switch (response.role) {
                case "Admin":
                    navigate("/admin");
                    break;

                case "Vendor":
                    navigate("/vendor");
                    break;

                case "Farmer":
                    navigate("/farmer");
                    break;

                default:
                    alert("Unknown user role.");
                    navigate("/");
            }
        } catch (error) {
            console.error(error);

            if (error.response) {
                alert(error.response.data.message || "Invalid username or password.");
            } else {
                alert("Unable to connect to the server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow p-4">

                        <h2 className="text-center mb-4 text-success">
                            KrishiKart Login
                        </h2>

                        <form onSubmit={handleLogin}>

                            <div className="mb-3">
                                <label className="form-label">Username</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success w-100"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;