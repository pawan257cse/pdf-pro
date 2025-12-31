import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Merge from './pages/Merge';
import Split from './pages/Split';
import Remove from './pages/Remove';
import Extract from './pages/Extract';
import JpgToPdf from './pages/JpgToPdf';
import PdfToJpg from './pages/PdfToJpg';
import Rotate from './pages/Rotate';
import PagesPerSheet from './pages/PagesPerSheet';
import Border from './pages/Border';
import Compress from './pages/Compress';
import Watermark from './pages/Watermark';
import PageNumbers from './pages/PageNumbers';
import Crop from './pages/Crop';
import Organize from './pages/Organize';
import PasswordProtect from './pages/PasswordProtect';
import BatchWatermark from './pages/BatchWatermark';
import MetadataEditor from './pages/MetadataEditor';
import Workspace from './pages/Workspace';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/" element={<Workspace />} />
        <Route path="/merge" element={<Merge />} />
        <Route path="/split" element={<Split />} />
        <Route path="/remove" element={<Remove />} />
        <Route path="/extract" element={<Extract />} />
        <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
        <Route path="/rotate" element={<Rotate />} />
        <Route path="/pages-per-sheet" element={<PagesPerSheet />} />
        <Route path="/border" element={<Border />} />
        <Route path="/compress" element={<Compress />} />
        <Route path="/watermark" element={<Watermark />} />
        <Route path="/page-numbers" element={<PageNumbers />} />
        <Route path="/crop" element={<Crop />} />
        <Route path="/organize" element={<Organize />} />
        <Route path="/password-protect" element={<PasswordProtect />} />
        <Route path="/batch-watermark" element={<BatchWatermark />} />
        <Route path="/metadata-editor" element={<MetadataEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
