"use client";

import AllUsers from "../components/all-users";
import React, { useState, useEffect } from "react";

export default function Page() {
    return (
        <div className="ml-24">
            <h1 className="mt-10 ml-5 text-3xl">Account Management</h1>
            <div className="ml-24 mt-12">
                <div className="flex">
                    <p className="mr-3 mt-1.5">Create Users</p>
                    <p>___________</p>
                    <p className="ml-3 mt-1.5">All Users</p>
                </div>
            </div>
            <div className="ml-24 mt-5">
                <AllUsers />
            </div>
        </div>
    );
}