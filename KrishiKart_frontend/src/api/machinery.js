import makeResource from './resource'
// Route matches the actual controller class name (MachineryController),
// not the file name (MachineriesController.cs) -> /api/Machinery
export default makeResource('/Machinery')
