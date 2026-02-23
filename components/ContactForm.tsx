'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContactForm } from '@/lib/strapi';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            await submitContactForm(formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (err) {
            console.error('Submission error:', err);
            setStatus('error');
            setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white rounded-[12px] p-8 md:p-12 shadow-sm  w-full max-w-[800px] mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block font-dm-sans font-bold text-[#2C2F24] text-base">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-full border border-[#DBDFD0] focus:outline-none focus:ring-2 focus:ring-[#AD343E] font-dm-sans text-[#495460]"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="block font-dm-sans font-bold text-[#2C2F24] text-base">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-full border border-[#DBDFD0] focus:outline-none focus:ring-2 focus:ring-[#AD343E] font-dm-sans text-[#495460]"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="subject" className="block font-dm-sans font-bold text-[#2C2F24] text-base">
                        Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="Write a subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-6 py-4 rounded-full border border-[#DBDFD0] focus:outline-none focus:ring-2 focus:ring-[#AD343E] font-dm-sans text-[#495460]"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="block font-dm-sans font-bold text-[#2C2F24] text-base">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Write your message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-6 py-4 rounded-[20px] border border-[#DBDFD0] focus:outline-none focus:ring-2 focus:ring-[#AD343E] font-dm-sans text-[#495460] resize-none"
                        required
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={status === 'submitting'}
                    className={`w-full bg-[#AD343E] hover:bg-[#8B2330] text-white font-dm-sans font-bold py-4 rounded-full transition-colors text-lg ${status === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {status === 'submitting' ? 'Sending...' : 'Send'}
                </motion.button>

                {status === 'success' && (
                    <p className="text-green-600 font-dm-sans text-center font-medium">
                        Message sent successfully! We will get back to you soon.
                    </p>
                )}
                {status === 'error' && (
                    <p className="text-red-600 font-dm-sans text-center font-medium">
                        {errorMessage}
                    </p>
                )}
            </form>
        </div>
    );
}
