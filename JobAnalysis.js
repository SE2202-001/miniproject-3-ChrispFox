//class to represent each job object
class Job {
    constructor(jobData) {
      //initialize job properties from the provided job data
      this.title = jobData.Title; //job title
      this.posted = jobData.Posted; //job posting date
      this.type = jobData.Type; //job type (e.g., Full-time, Part-time)
      this.level = jobData.Level; //job level (e.g., Entry, Mid, Senior)
      this.skill = jobData.Skill; //skill required for the job
      this.detail = jobData.Detail; //detailed job description
    }
  
    //method to return a summary of the job for display in the job list
    getSummary() {
      return `${this.title} - ${this.type} (${this.level})`;
    }
  
    //method to return detailed information about the job for the modal
    getDetails() {
      return `
        <p><strong>Title:</strong> ${this.title}</p>
        <p><strong>Type:</strong> ${this.type}</p>
        <p><strong>Level:</strong> ${this.level}</p>
        <p><strong>Skill:</strong> ${this.skill}</p>
        <p><strong>Description:</strong> ${this.detail}</p>
        <p><strong>Posted:</strong> ${this.posted}</p>
      `;
    }
  }
  
  //array to store job objects after loading from the file
  let jobs = [];
  
  //event listener for file upload input
  document.getElementById("fileInput").addEventListener("change", handleFileUpload);
  
  //event listener for Filter Jobs button
  document.getElementById("filterJobsButton").addEventListener("click", filterJobs);
  
  //event listener for Sort Jobs button
  document.getElementById("sortJobsButton").addEventListener("click", sortJobs);
  
  //event listener for modal close button
  document.getElementById("closeModal").addEventListener("click", closeModal);
  
  //function to handle file upload and parse JSON data
  function handleFileUpload(event) {
    const file = event.target.files[0]; //get the uploaded file
    if (!file) return; //if no file is uploaded, exit the function
  
    const reader = new FileReader(); //create a FileReader to read the file
    reader.onload = function () {
      try {
        //parse the file content as JSON
        const data = JSON.parse(reader.result);
  
        //map the parsed data to Job objects and store them in the jobs array
        jobs = data.map((jobData) => new Job(jobData));
  
        //populate the dropdown filters with data from the jobs array
        populateFilters();
  
        //display all jobs in the job list
        displayJobs(jobs);
      } catch (err) {
        //show an error message if the file is not in valid JSON format
        alert("Invalid JSON format.");
      }
    };
    reader.readAsText(file); //read the file as text
  }
  
  //function to populate filter dropdowns dynamically
  function populateFilters() {
    //get unique levels, types, and skills from the jobs array
    const levels = new Set(jobs.map((job) => job.level));
    const types = new Set(jobs.map((job) => job.type));
    const skills = new Set(jobs.map((job) => job.skill));
  
    //populate the corresponding dropdowns
    updateDropdown("filterLevel", levels);
    updateDropdown("filterType", types);
    updateDropdown("filterSkill", skills);
  }
  
  //function to update a dropdown with given values
  function updateDropdown(id, values) {
    const select = document.getElementById(id); //get the dropdown element by ID
    select.innerHTML = '<option value="All">All</option>'; //add default "All" option
    values.forEach((value) => {
      //add each value as an option to the dropdown
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }
  
  //function to display jobs in the job list
  function displayJobs(jobList) {
    const jobListElement = document.getElementById("jobList"); //get the job list container
    jobListElement.innerHTML = ""; //clear existing job items
  
    if (jobList.length === 0) {
      //if no jobs to display, show a message
      jobListElement.innerHTML = "<li>No jobs found.</li>";
      return;
    }
  
    //create a list item for each job and add it to the container
    jobList.forEach((job, index) => {
      const listItem = document.createElement("li");
      listItem.className = "job-item"; //add a class for styling
      listItem.textContent = job.getSummary(); //aet the job summary as text
      listItem.addEventListener("click", () => showJobDetails(index)); //add click event to show details
      jobListElement.appendChild(listItem); //append the list item to the container
    });
  }
  
  //function to filter jobs based on selected filters
  function filterJobs() {
    //get selected filter values
    const level = document.getElementById("filterLevel").value;
    const type = document.getElementById("filterType").value;
    const skill = document.getElementById("filterSkill").value;
  
    //filter the jobs based on selected values
    const filtered = jobs.filter((job) => {
      return (
        (level === "All" || job.level === level) &&
        (type === "All" || job.type === type) &&
        (skill === "All" || job.skill === skill)
      );
    });
  
    // Display the filtered jobs
    displayJobs(filtered);
  }
  
  //function to sort jobs based on the selected sort option
  function sortJobs() {
    const sortOption = document.getElementById("sortBy").value; //get selected sort option
  
    if (sortOption === "title") {
      //sort alphabetically by title (A-Z)
      jobs.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "titleZtoA") {
      //sort alphabetically by title (Z-A)
      jobs.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === "postedTime") {
      //sort by oldest posting date (ascending)
      jobs.sort((a, b) => new Date(a.posted) - new Date(b.posted));
    } else if (sortOption === "newestTime") {
      //sort by newest posting date (descending)
      jobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));
    }
  
    //redisplay the sorted jobs
    displayJobs(jobs);
  }
  
  //function to show job details in a modal
  function showJobDetails(index) {
    const job = jobs[index]; //get the job by index
    const modal = document.getElementById("jobModal"); //get the modal element
    const overlay = document.getElementById("modalOverlay"); //get the modal overlay
    const details = document.getElementById("jobDetails"); //get the details container
  
    details.innerHTML = job.getDetails(); //set the job details
    modal.style.display = "block"; //show the modal
    overlay.style.display = "block"; //show the overlay
  }
  
  //function to close the modal
  function closeModal() {
    const modal = document.getElementById("jobModal"); //get the modal element
    const overlay = document.getElementById("modalOverlay"); //get the modal overlay
  
    modal.style.display = "none"; //hide the modal
    overlay.style.display = "none"; //hide the overlay
  }
  