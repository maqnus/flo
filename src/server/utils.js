import { uploader } from './config/cloudinaryConfig';

export const slugify = string => {
    const a =
      "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
    const b =
      "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------";
    const p = new RegExp(a.split("").join("|"), "g");
  
    return string
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, "-and-") // Replace & with 'and'
      .replace(/[^\w\-]+/g, "") // Remove all non-word characters
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  };

export const getDepartments = async (db) => await db
  .ref("departments/")
  .once("value")
  .then(snapshot => snapshot.val())
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

export const getSpesificDepartment = async (db, department) => await db
  .ref(`departments/${department}`)
  .once("value")
  .then(snapshot => snapshot.val())
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

export const getUidFromSlug = async (db, slug) => await db
  .ref(`slug-to-user-id-map/${slug}`)
  .once("value")
  .then(snapshot => snapshot.val())
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

export const getUserData = async (db, uid) => await db
  .ref("users/" + uid)
  .once("value")
  .then(snapshot => snapshot.val())
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

export const getMessageRequests = async (db, uid) => await db
    .ref("user-request/" + uid)
    .once("value")
    .then(snapshot => snapshot.val())
    .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
    });

export const getProjectData = async (db, pid) => await db
  .ref("projects/" + pid)
  .once("value")
  .then(snapshot => snapshot.val())
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

export const getProjects = async (db) => await db
  .ref("projects/")
  .once("value")
  .then(snapshot => snapshot.val())
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });


 export const uploadSingleImageToCloudinary = file => new Promise(async resolve => uploader.upload(file).then((result) => resolve(result.url)));
