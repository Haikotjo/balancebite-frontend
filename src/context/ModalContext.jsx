import PropTypes from "prop-types";
import { createContext, useState } from "react";
import CustomModal from "../components/layout/CustomModal.jsx";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalContent, setModalContent] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [modalData, setModalData] = useState(null); // ✅ NIEUW

    const openModal = (content, type = null, data = null) => {
        setModalContent(content);
        setModalType(type);
        setModalData(data);
    };

    const closeModal = () => {
        setModalContent(null);
        setModalType(null);
        setModalData(null);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal, modalType, modalData }}>
            {children}
            <CustomModal isOpen={!!modalContent} onClose={closeModal}>
                {modalContent}
            </CustomModal>
        </ModalContext.Provider>
    );
};

ModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
