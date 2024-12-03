import BookRequestForm from "./components/molecules/BookRequestForm";
import MembersPage from "./components/organisms/MemberList";
import AddBookPage from "./components/pages/AddBookPage";
import BookDetailPage from "./components/pages/BookDetailPage";
import BooksPage from "./components/pages/BooksPage";
import HomePage from "./components/pages/HomePage";
import MemberDetailPage from "./components/pages/MemberDetailPage";
import Register from "./components/pages/register";
import UploadFiles from "./components/pages/uploadfile";

export const routers = createBrowserRouter([
    {   
     // {/* Route yang Membutuhkan Login (Semua User) */}
     element: <PrivateRoute allowedRoles={['Librarian', 'Library Manager', 'Library User']}/>,
     children: [{
       path: "/profile",
       element: <Profile />,
     }]
    },     
    {   
     // {/* Route Khusus Librarian */}
     element: <PrivateRoute allowedRoles={['Librarian']}/>,            
     children: [
       {
          path: "/books",
          element: <BooksPage />,
       },
       {
          path: "/books/add",
          element: <AddBookPage />,
       },
       {
          path: "/books/:id",
          element: <BookDetailPage />,
       },
       {
        path: "/upload",
        element: <UploadFiles />,
       },
      ]
    },     
    {   
       // {/* Route Khusus Library Manager */}
       element: <PrivateRoute allowedRoles={['Library Manager']}/>,            
       children: [
         {
           path: "/members",
           element: <MembersPage />,
         },       
         {
           path: "/upload",
           element: <UploadFiles />,
         },       
       ]
    },
    {   
        // {/* Route Khusus Library Manager */}
        element: <PrivateRoute allowedRoles={['Library User']}/>,            
        children: [
          {
            path: "/users/:id",
            element: <MemberDetailPage />,
          },       
          {
            path: "/bookrequest/new",
            element: <BookRequestForm />,
          },       
        ]
    },          
    {/* Rute Publik */
       element: <Layout />,
       children: [
         {
           path: "/",
           element: <HomePage />,
         },
         {
           path: "/login",
           element: <Login />,
         },
         {
            path: "/register",
            element: <Register />,
         },
         {
           path: "/register",
           element: <Register />,
         },    
         {/* Halaman Unauthorized */
           path: "/unauthorized",
           element: <Unauthorized />
         },
        ]   
    } 
])    