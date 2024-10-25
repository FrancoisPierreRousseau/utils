import ytdl from "ytdl-core";

/*
    Création d'une extension google chrome qui lie un flux d'audio. 
    On peut stocker via une bdd sqlite les audios youtube sans aucun compte 
    SQLite stockera des url(s) 
    Mon app les récupérera pour ensuite les diffusé via des stream sur mon pc
*/

const audio = new AudioContext();

const videoUrl =
  "https://www.youtube.com/watch?v=tyN8FHmGRLs&list=RDVbRmFSQYeac&index=2";

const stream = ytdl(videoUrl, { filter: "audioonly" });

stream.on("data", (chunk) => {
  console.log(chunk.toString());
});
