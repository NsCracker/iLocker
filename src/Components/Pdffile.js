import { useEffect, useState } from "react";
import axios from "axios"; 
import { pdfjs } from "react-pdf";    //for react open
import PdfComp from "./Pdfcomp";    //for react open
import { useNavigate } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(    //for react open
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function Pdffile() {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");
    const [allImage, setAllImage] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);     //for react open
    let navigate = useNavigate();


    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate("/login");  // Redirect to login if no token
        } else {
            getPdf();
        }
    }, [navigate]);

    const getPdf = async () => {
        try {
            const token = localStorage.getItem('token');
         if (!token) {
             navigate("/login"); // Redirect if no token found
             return;
         }

         const result = await axios.get("http://localhost:5000/api/pdfs/get-files", {
             headers: {
                 "auth-token": token, // Include the token for authentication
             },
         });

         setAllImage(result.data.data); // Populate the images
        } catch (error) {
            console.error("Error fetching PDFs:", error);
        }
    };

    
    const submitImage = async (e) => {
        e.preventDefault();

        if (!title || !file) {
            alert("Please enter a title and select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        const token = localStorage.getItem('token');  // Get token from localStorage
        if (!token) {
            alert("You need to be logged in.");
            navigate("/login");
            return;
        }

        try {
            const result = await axios.post("http://localhost:5000/api/pdfs/upload-files", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "auth-token": token,  // Include token in headers
                },
            });

            if (result.data && result.data._id) {
                alert("Uploaded Successfully!!!");
                getPdf();

                setTitle({title: ""})
                setFile(null)
                

            } else {
                alert("Error uploading file.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file.");
        }
    };

    

    const showPdf = (pdf) => {
        window.open(`http://localhost:5000/api/pdfs/files/${pdf}`, "_blank", "noreferrer");   
        setPdfFile(`http://localhost:5000/api/pdfs/files/${pdf}`)  //for react open
      };
    return (
        <div className="App">
            <form className="formStyle" onSubmit={submitImage}>
                <h4>Upload Doc</h4>
                <br />
                <input type="text" className="form-control" placeholder="Title" minLength={3}  onChange={(e) => setTitle(e.target.value)} required />
                <br />
                <input type="file" className="form-control" accept="multipart/form-data"  onChange={(e) => setFile(e.target.files[0])} required />
                <br />
                <button disabled={title.length<3 || !file} className="btn btn-primary" type="submit">Add Document</button>
            </form>
            <div className="uploaded">
                <h4>Uploaded PDF:</h4>
                <div className="output-div">
                    {allImage == null ? "" : allImage.map((data) => {
                        return (
                            <div className="inner-div" key={data._id}>
                                <h6>Title: {data.title}</h6>
                                <button className="btn btn-primary" onClick={() => showPdf(data.pdf)}>Show Pdf</button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <PdfComp pdfFile={pdfFile} />    {/*for react open */}
        </div>
    );
}

export default Pdffile;
