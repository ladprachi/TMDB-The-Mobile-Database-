import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Homepage from "./Home/Homepage";
import Moviecard from "./Movie-list/Movie-card";
import Movielist from  "./Person-List/Movie-list";
import MovieForm from "./Movie-list/Form";
import CreatePerson from "./Person-List/Create";
import View from "./Movie-list/View";
import Edit from "./Movie-list/Edit";
import ViewButton from "./Person-List/ViewButton";
import EditButton from "./Person-List/EditButton";
import SignUp from "./Components/Signup";

function App() {
  return (
    <div className="center">
      <Router>
        <Navbar />
        <div className="background-gray">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<SignUp/>}/>
            //movie-card
            <Route path="/movie-card" element={<Moviecard />} />
            <Route path="/movie-card/form" element={<MovieForm />} />
            <Route path="/form/movie-card" element={<Moviecard />} />
            <Route path="/movie-card/:movie_id/view" element={<View />} />
            <Route path="/movie-card/:movie_id/edit" element={<Edit />} />
            //person-list
            <Route path="/person-list" element={<Movielist />} />
            <Route path="/person-list/create" element={<CreatePerson />} />
            <Route path="/create/person-list" element={<Movielist />} />
            <Route path="/person-list/:person_id/edit" element={<EditButton />} />
            <Route path="/person-list/:person_id/view" element={<ViewButton />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
