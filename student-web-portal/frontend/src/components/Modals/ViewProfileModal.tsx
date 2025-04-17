import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Avatar,
  Switch,
  Box,
  Chip,
  Grid,
} from '@mui/material';
import axios from 'axios'
interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ViewProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [userInfo, setUserInfo] = useState<any>(null);    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkUser = async () => {
        const tok = localStorage.getItem('auth_token');
        const user = await axios.post('https://capstoneserver-puce.vercel.app/studentInfo', {
            user:tok
          },
          { headers: { 'Authorization': `Bearer ${tok}` } }
        )
          setUserInfo(user.data.userInfo);
          setLoading(false)
      };
      
  
      if (isOpen) checkUser();;
    }, [isOpen]);

    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ bgcolor: '#121212', color: '#fff', p: 4 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress color="inherit" />
            </Box>
          ) : (
            <>
              {/* Top Profile Section */}
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={userInfo?.avatar_url || ''}
                  alt={userInfo?.name || 'User'}
                  sx={{ width: 64, height: 64 }}
                />
                <Box>
                  <Typography variant="h6">{userInfo.name || 'Full Name'}</Typography>
                  <Typography variant="body2" color="gray">{userInfo.email}</Typography>
                  <Chip label={userInfo?.number} color="info" size="small" sx={{ mt: 1 }} />
                </Box>
              </Box>

              <Divider sx={{ my: 3, borderColor: '#444' }} />

              {/* User Stats Row */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="caption" color="gray">Joined</Typography>
                  <Typography>{new Date(userInfo.created_at).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="gray">Class</Typography>
                  <Typography>{userInfo.class || 'Senior'}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" color="gray">Face Verified</Typography>
                  <Typography>{userInfo.face_model?.length > 0 ? '✅' : '❌'}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3, borderColor: '#444' }} />

              {/* Permissions Section */}
              <Box>
                <Typography fontWeight="bold" gutterBottom>Permissions</Typography>

                {[
                  { label: 'Data Export', desc: 'Can download and export reports and data.' },
                  { label: 'Data Import', desc: 'Can import reports and data.' },
                  { label: 'Account', desc: 'Can manage their own account info.' }
                ].map((perm, idx) => (
                  <Box key={idx} display="flex" alignItems="center" justifyContent="space-between" my={1}>
                    <Box>
                      <Typography>{perm.label}</Typography>
                      <Typography variant="caption" color="gray">{perm.desc}</Typography>
                    </Box>
                    <Switch defaultChecked={false} color="primary" />
                  </Box>
                ))}
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ bgcolor: '#121212', p: 2 }}>
          <Button onClick={onClose} variant="outlined" color="primary">Cancel</Button>
          <Button variant="contained" color="primary">Save changes</Button>
        </DialogActions>
      </Dialog>
    );
}

export default ViewProfileModal;
