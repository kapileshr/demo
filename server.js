
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://lmvcxgkqhjcxihtczrzz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdmN4Z2txaGpjeGlodGN6cnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNDkwMDQsImV4cCI6MjA0OTkyNTAwNH0.HXtYlmV0QjE-EvmeKBDgX6mlNvO1kYWDeih_OtbTC4k')


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/register', async (req, res) => {
    try {
        const { name, eid, email, mobileno, department, doj, role } = req.body;

        // Helper functions
        const ifEmailExists = async (email) => {
            const { data, error } = await supabase
                .from("users")
                .select("email")
                .eq("email", email);

            if (error) throw new Error(`Error checking email: ${error.message}`);
            return data.length > 0;
        };

        const ifIdExists = async (eid) => {
            const { data, error } = await supabase
                .from("users")
                .select("eid")
                .eq("eid", eid);

            if (error) throw new Error(`Error checking ID: ${error.message}`);
            return data.length > 0;
        };

        // Check if email or ID already exists
        const emailExists = await ifEmailExists(email);
        const idExists = await ifIdExists(eid);

        if (emailExists) {
          console.log("email exists");
            return res.status(400).json({ message: "exist-email" });
        }

        if (idExists) {
          console.log("id exists");
            return res.status(400).json({ message: "exist-id" });
        }

        // Save user data
        const saveData = async () => {
            const { data, error } = await supabase
                .from("users")
                .insert({
                    name,
                    eid,
                    email,
                    mobileno,
                    department,
                    doj,
                    role,
                })
                .select(); // Returns the inserted data

            if (error) throw new Error(`Error saving data: ${error.message}`);
            return data;
        };

        const insertedData = await saveData();
        res.status(200).json({ message: "User registered successfully", data: insertedData });

    } catch (e) {
        console.error(`Error in /register endpoint: ${e.message}`);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.listen(8080,()=>{
  console.log("server is running on porty 8080");
})