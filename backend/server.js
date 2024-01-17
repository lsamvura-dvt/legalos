const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const dbConfig = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Ar3w3s@f3',
    database: 'legalos',
    max: 10, 
    idleTimeoutMillis: 30000, 
    
};

const pool = new Pool(dbConfig);

const executeQuery = async (query, values) => {
    const client = await pool.connect();
    try {
        const result = await client.query(query, values);
        return { rowCount: result.rowCount, rows: result.rows };
    } finally {
        client.release();
    }
};


const saveResumeExtractedData = async (fileName) => {
    try {
        const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
        const resumeKey = `${currentDate}_${fileName}`;

        const resumeExtractedDataQuery = 'INSERT INTO resume_extracted_data (file_name, creation_date, resume_key) VALUES ($1, $2, $3) RETURNING id';
        const result = await executeQuery(resumeExtractedDataQuery, [fileName, currentDate, resumeKey]);

        if (result && result.rowCount > 0) {
            return result.rows[0].id;
        } else {
            throw new Error('Invalid result from saveResumeExtractedData');
        }
    } catch (error) {
        console.error('Error saving resume extracted data:', error.message);
        throw error;
    }
};


const savePersonalInformation = async (personalInfo, resumeKey) => {
    const personalInfoQuery = 'INSERT INTO personal_information (first_name, last_name, email, phone, profile_summary, resume_key) VALUES ($1, $2, $3, $4, $5, $6)';
    
    const name = personalInfo.name;
    const mails = personalInfo.mails;
    const phones = personalInfo.phones;
    const self_summary = personalInfo.self_summary || null;

    const personalInfoValues = [
        name.first_name,
        name.last_name,
        mails[0],
        phones[0],
        self_summary,
        resumeKey,
    ];

    await executeQuery(personalInfoQuery, personalInfoValues);
};


const saveWorkExperience = async (workExperience, resumeKey) => {
    const workExperienceQuery = 'INSERT INTO work_experience (title, start_date, end_date, company, description, resume_key) VALUES ($1, $2, $3, $4, $5, $6)';

    if (workExperience && Array.isArray(workExperience)) {
        const workExperienceValues = workExperience.map(experience => [
            experience.title,
            experience.start_date !== null ? new Date(experience.start_date) : null,
            experience.end_date !== null ? new Date(experience.end_date) : null,
            experience.company,
            experience.description,
            resumeKey,
        ]);

        await Promise.all(workExperienceValues.map(async (values) => {
            console.log("Work Experience Values:", values);
            await executeQuery(workExperienceQuery, values);
        }));
    } else {
        console.error("Invalid format for workExperience.entries:", workExperience);
    }
};

const saveEducation = async (education, resumeKey) => {
    const educationQuery = 'INSERT INTO education (school, study, start_date, end_date, resume_key) VALUES ($1, $2, $3, $4, $5)';

    if (education && Array.isArray(education)) {
        const educationValues = education.map(edu => [
            edu.establishment,
            edu.accreditation,
            edu.start_date !== null ? new Date(edu.start_date) : null,
            edu.end_date !== null ? new Date(edu.end_date) : null,
            resumeKey,
        ]);

        await Promise.all(educationValues.map(async (values) => {
            try {
                console.log("Education Values:", values);
                await executeQuery(educationQuery, values);
            } catch (error) {
                if (error.code === '23502' && error.column === 'start_date') {
                    // Handle the case where there's an attempt to insert a null value in start_date
                    console.error('Error saving education data - null value in start_date:', error.detail);
                } else {
                    throw error; // Propagate other errors
                }
            }
        }));
    } else {
        console.error("Invalid format for education.entries:", education);
    }
};





const saveLanguage = async (languages, resumeKey) => {
    const languageQuery = 'INSERT INTO languages (language_name, resume_key) VALUES ($1, $2)';

    await Promise.all(languages.map(async (language) => {
        const languageValues = [language.name, resumeKey];

        console.log("Language Values:", languageValues);  

        await executeQuery(languageQuery, languageValues);
    }));
};

const saveSkills = async (skills, resumeKey) => {
    const skillsQuery = 'INSERT INTO skills (name, resume_key) VALUES ($1, $2)';
    const skillsValues = skills.map(skill => [skill.name, resumeKey]);

    await Promise.all(skillsValues.map(async (values) => {
        console.log("Skills Values:", values);  
        await executeQuery(skillsQuery, values);
    }));
};
    


app.post('/saveResumeData', async (req, res) => {
    try {
        const { resumeData, fileName } = req.body;

        if (resumeData && resumeData.senseloaf && resumeData.senseloaf.status === "success") {
            const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

            const resumeKey = `${currentDate}_${fileName}`;

            await saveResumeExtractedData(fileName);

            if (resumeData.senseloaf.extracted_data.personal_infos) {
                await savePersonalInformation(resumeData.senseloaf.extracted_data.personal_infos, resumeKey);
            }

            if (resumeData.affinda && resumeData.affinda.extracted_data && resumeData.affinda.extracted_data.languages) {
                await saveLanguage(resumeData.affinda.extracted_data.languages, resumeKey);
            }

            await saveSkills(resumeData.senseloaf.extracted_data.skills, resumeKey);

            await saveWorkExperience(resumeData.senseloaf.extracted_data.work_experience.entries, resumeKey);

            await saveEducation(resumeData.senseloaf.extracted_data.education.entries, resumeKey);

            res.status(200).json({ message: 'Resume data saved successfully' });
        } else {
            throw new Error('Invalid condition for saving resume data');
        }
    } catch (error) {
        console.error('Error saving resume data:', error);
        res.status(500).json({ error: 'Error saving resume data to the database' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});