import React, { useState } from "react";
import Button from "./components/widgets/Button";
import FormInput from "./components/widgets/FormInput";
import LoadingSpinner from "./components/widgets/LoadingSpinner";

const App = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : null);
  };

  const uploadResume = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("providers", "senseloaf, affinda");
    formData.append("file", file);
    formData.append("fallback_providers", "");


    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzBkMTUxMTktOWI2OS00MDgxLThlMjktNDc5OGE0ZDk3ZmYzIiwidHlwZSI6ImFwaV90b2tlbiJ9.7eFSXBSXVCEh5N62Y-07-D17ZvBeZqlnWcjHzWbfDIw',
      },
      body: formData,
    };

    try {
      const response = await fetch('https://api.edenai.run/v2/ocr/resume_parser', options);
      const data = await response.json();
      console.log('API Response:', data);

      setResponseData(data);
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResumeDataToServer = async () => {
    setLoading(true);
    console.log('Response Data:', responseData);

    if (!responseData || !responseData.senseloaf) {
      console.error('Error: Invalid responseData format');
      return;
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: fileName,
        resumeData: responseData,
      }),
    };

    try {
      const response = await fetch('http://localhost:5000/saveResumeData', options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      setAlert({
        type: 'success',
        message: 'Data saved successfully!',
      });

      setTimeout(() => {
        setAlert(null);
      }, 5000);
    } catch (error) {
      console.error('Error saving data to the server:', error);
      setAlert({
        type: 'error',
        message: 'Error saving data. Please try again.',
      });

      setTimeout(() => {
        setAlert(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="font-Comfortaa ">

      {loading && <LoadingSpinner />}
      {!loading && (!responseData || responseData.length === 0) && (
        <div className="w-full lg:w-8/12 items-center mx-auto py-60">
          <label htmlFor="uploadFile1"
            className="bg-white text-black text-base rounded w-80 h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 mb-2 fill-black" viewBox="0 0 32 32">
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000" />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000" />
            </svg>
            Select your CV or drag and drop here
            <input type="file" id='uploadFile1' className="hidden" onChange={handleFileChange} />
            <p className="text-xs text-gray-400 mt-2">PNG, JPG or PDF are Allowed.</p>
            {fileName && <p className="text-xs text-gray-400 mt-2">{fileName}</p>}
          </label>
          <div className="h-28 grid grid-cols-1 content-center px-96">
            <button onClick={uploadResume} className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" type="button">
              Upload
            </button></div>
        </div>
      )}



      {responseData && responseData.senseloaf && responseData.senseloaf.status === "success" && (
        <div>
          {alert && (
            <div className={`flex items-center w-full lg:w-8/12 px-4 mx-auto mt-6 ${alert.type === 'success' ? 'bg-teal-100 border-teal-500 ' : 'bg-red-500'} text-teal-900 text-sm font-bold px-4 py-3`} role="alert">
              {alert.type === 'success' ? (
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                </svg>
              ) : (
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M10 0c5.522 0 10 4.477 10 10s-4.478 10-10 10S0 15.523 0 10 4.478 0 10 0zm0 18c4.411 0 8-3.588 8-8s-3.589-8-8-8-8 3.588-8 8 3.589 8 8 8zM11 14H9v-2h2v2zm0-4H9V5h2v5z" />
                </svg>
              )}
              <p>{alert.message}</p>
            </div>
          )}

          <section className=" py-1  ">
            <div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0 bg-white">
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-900 text-md mt-3 mb-6 font-bold uppercase">
                  
                    </h6>
                    <div className="text-center flex justify-end">
                      <Button buttonText="Cancel" onClick={() => window.location.reload()} />
                      <Button buttonText="Submit" onClick={saveResumeDataToServer} />
                    </div>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <form>
                    <h6 className="text-blueGray-400 text-md mt-3 mb-6 font-bold uppercase">
                    {responseData.senseloaf.extracted_data.personal_infos.name.first_name} {responseData.senseloaf.extracted_data.personal_infos.name.last_name} 
                    </h6>
                    <div className="flex flex-wrap border border-gray-200 rounded-md p-8 mt-8" >
                     
                    <p class="mt-2 text-sm">
                      {responseData.affinda.extracted_data.personal_infos.self_summary}
                        </p>
                      <div className="w-full lg:w-6/12 px-4 mt-6">
                        <div className="relative w-full mb-3">
                          <FormInput type="email" title="Email Address" value={responseData.senseloaf.extracted_data.personal_infos.mails[0]} />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4 mt-6">
                        <div className="relative w-full mb-3">
                          <FormInput type="text" title="Phone" value={responseData.senseloaf.extracted_data.personal_infos.phones[0]} />
                        </div>
                      </div>

                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-md mt-3 mb-6 font-bold uppercase">
                      Skills <span className="text-gray-500 font-normal text-md"> ({responseData.senseloaf.extracted_data.skills.length})</span>
                    </h6>
                    <div className="flex flex-wrap">
                      {responseData.senseloaf.extracted_data.skills.map((skill, index) => (
                        <div key={index} className="w-full lg:w-auto px-4 mb-3">
                          <Button className="rounded-full bg-blue-100 text-blue-500 font-semibold text-xl" buttonText={skill.name} />
                        </div>
                      ))}
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-md mt-3 mb-6 font-bold uppercase">
                      Languages <span className="text-gray-500 font-normal text-md"> ({responseData.affinda.extracted_data.languages.length})</span>
                    </h6>
                    <div className="flex flex-wrap">
                      {responseData.affinda.extracted_data.languages.map((language, index) => (
                        <div key={index} className="w-full lg:w-auto px-4 mb-3">
                          <Button className="rounded-full bg-blue-100 text-blue-500 font-semibold text-xl" buttonText={language.name} />
                        </div>
                      ))}
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-900 text-md mt-3 mb-6 font-black uppercase">
                      Work Experience <span className="text-gray-500 font-normal text-md"> ({responseData.senseloaf.extracted_data.work_experience.entries.length})</span>
                    </h6>
                    {responseData.senseloaf.extracted_data.work_experience.entries.map((experience, index) => (
                         <div className="flex flex-wrap border border-gray-200 rounded-md p-8 mt-8" key={index}>
                        <div class="flex justify-between flex-wrap gap-2 w-full">
                          <span class="block text-blueGray-900 text-sm mt-3 mb-2 font-bold uppercase">{experience.title}</span>
                          <p>
                            <span class="block text-gray-900 text-sm mt-3 mb-2 font-bold uppercase">{experience.company}</span>
                            <span class="text-gray-700">{experience.start_date} - {experience.end_date}</span>
                          </p>
                        </div>
                        <p class="mt-2 text-sm">
                          {experience.description}
                        </p>
                      </div>
                    ))}

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-md mt-3 mb-6 font-bold uppercase">
                      Education  <span className="text-gray-500 font-normal text-md"> ({responseData.senseloaf.extracted_data.education.entries.length})</span>
                    </h6>
                    {responseData.senseloaf.extracted_data.education.entries.map((education, index) => (
                      <div class="mb-6" key={index}>
                        <div class="flex justify-between flex-wrap gap-2 w-full">  <p>
                          <span class="block text-gray-900 text-sm mt-3 mb-2 font-semibold uppercase">{education.establishment}</span>
                          <span class="block text-gray-600 text-sm mt-3 mb-2 font-semibold uppercase">{education.accreditation}</span>
                        </p>
                          <span class="text-gray-700">{education.start_date} - {education.end_date}</span>
                        </div>
                      </div>
                    ))}

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-md mt-3 mb-6 font-bold uppercase">
                      Certifications <span className="text-gray-500 font-normal text-md"> ({responseData.affinda.extracted_data.certifications.length})</span>
                    </h6>
                    <div className="flex flex-wrap border border-gray-200 rounded-md p-8 mt-8">
                      {responseData.affinda.extracted_data.certifications.map((certification, index) => (
                        <div key={index} className="w-full lg:w-auto px-4 mb-3">
                          <Button className="rounded-full bg-blue-100 text-blue-500 text-xl font-semibold" buttonText={certification.name} />
                        </div>
                      ))}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>)}

    </div>
  );
};

export default App;
