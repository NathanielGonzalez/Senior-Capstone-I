import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import supabase from '../../utils/supabaseClient';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ViewProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [userInfo, setUserInfo] = useState<any>(null);    

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user} } = await supabase.auth.getUser();
            if (!user) return;
            
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (!error) setUserInfo({...data, email: user.email, created_at: user.created_at });
        };

        if (isOpen) fetchUser();
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center" className='z-[100]'>
          <ModalContent>
            <ModalHeader className="text-lg font-bold">Your Profile</ModalHeader>
            <ModalBody className="space-y-3 text-sm text-gray-700">
              {userInfo ? (
                <>
                  <div><strong>Full Name:</strong> {userInfo.full_name || "Not set"}</div>
                  <div><strong>Email:</strong> {userInfo.email}</div>
                  <div><strong>Phone:</strong> {userInfo.phone || "Not set"}</div>
                  <div><strong>Account Created:</strong> {new Date(userInfo.created_at).toLocaleDateString()}</div>
                  <div>
                    <strong>Verified Face Model:</strong>{" "}
                    {userInfo.face_model && userInfo.face_model.length > 0 ? "✅" : "❌"}
                  </div>
                </>
              ) : (
                <div>Loading profile...</div>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
    );
}

export default ViewProfileModal;
