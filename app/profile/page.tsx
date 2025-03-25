'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile, updateUserProfile } from '@/lib/userService';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [uid, setUid] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setName(profile.name || '');
          setBio(profile.bio || '');
        }
      }
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    if (!uid) return;
    await updateUserProfile(uid, { name, bio });
    toast.success('Profile updated');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-md mx-auto mt-10 p-6"
    >
      <motion.h1
        className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
        whileHover={{ scale: 1.05 }}
      >
        Profile Settings
      </motion.h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-3 py-2 w-full rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
      />
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="border px-3 py-2 w-full h-32 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
      />
      <Button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-extrabold rounded-lg cursor-pointer px-4 py-2 transition-all duration-200 hover:scale-105 hover:shadow-lg"
      >
        Save
      </Button>
    </motion.div>
  );
}
