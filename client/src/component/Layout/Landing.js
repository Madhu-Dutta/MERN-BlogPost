import React from 'react';
import {Link} from 'react-router-dom';

export default function Landing() {
    return (
        <section className="landing">
            <div className="dark-overlay">
                <div className="landing-inner">
                    <h1 className="x-large">Developer connector</h1>
                    <p className="lead">
                        Create developer profile/portfolio
                    </p>
                    <div className="buttons">
                        <Link to="/register" className="btn btn-primary">
                            SignUp
                        </Link>
                        <Link to="/login" className="btn btn-light">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
