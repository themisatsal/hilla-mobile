import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Shield, Check, ChevronLeft, Eye, FileText, Scale, ChevronRight, ArrowUp } from 'lucide-react-native';
import { useState, useRef } from 'react';

interface PrivacyDisclaimerStepProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function PrivacyDisclaimerStep({ onComplete, onBack }: PrivacyDisclaimerStepProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [activeModal, setActiveModal] = useState<'privacy' | 'medical' | 'terms' | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleContinue = () => {
    if (isChecked) {
      onComplete();
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(offsetY > 200);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const openModal = (modalType: 'privacy' | 'medical' | 'terms') => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case 'privacy':
        return (
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy (GDPR Compliant)</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Data Collection:</Text> We collect only the information necessary to provide personalized nutrition guidance. This includes your name, life stage, dietary preferences, and nutrition tracking data.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Data Processing:</Text> Your personal data is processed on-device where possible. When cloud processing is required, all data is encrypted in transit and at rest using industry-standard encryption.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Your Rights:</Text> Under GDPR, you have the right to access, rectify, erase, restrict processing, data portability, and object to processing of your personal data. You can exercise these rights at any time through the app settings.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Data Retention:</Text> We retain your data only as long as necessary to provide our services. You can delete your account and all associated data at any time.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Third Parties:</Text> We do not sell your personal data. We may share anonymized, aggregated data for research purposes only with your explicit consent.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Cookies:</Text> We use essential cookies for app functionality. Analytics cookies are only used with your consent and can be disabled in settings.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Contact:</Text> For privacy questions, contact us at privacy@hilla.app or our Data Protection Officer at dpo@hilla.app.
              </Text>
            </ScrollView>
          </View>
        );

      case 'medical':
        return (
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Medical Disclaimer</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Not Medical Advice:</Text> Hilla provides general nutritional information and guidance. This information is not intended as medical advice, diagnosis, or treatment recommendations.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Professional Care:</Text> Always consult with qualified healthcare professionals, including your doctor, midwife, or registered dietitian, before making significant dietary changes, especially during pregnancy, breastfeeding, or when trying to conceive.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Individual Needs:</Text> Nutritional needs vary significantly between individuals. Our recommendations are general guidelines and may not be appropriate for your specific health conditions, allergies, or medical requirements.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Emergency Situations:</Text> If you experience any concerning symptoms or medical emergencies, seek immediate medical attention. Do not rely on this app for urgent health decisions.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Supplement Safety:</Text> Before taking any supplements recommended by the app, consult with your healthcare provider, especially during pregnancy or if you have existing health conditions.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Liability:</Text> Hilla and its developers are not liable for any health outcomes resulting from the use of this application. Use of this app is at your own risk.
              </Text>
            </ScrollView>
          </View>
        );

      case 'terms':
        return (
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms of Service</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Acceptance:</Text> By using Hilla, you agree to these terms and our privacy policy. If you do not agree, please do not use the app.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Service Availability:</Text> We strive to maintain service availability but cannot guarantee uninterrupted access. We reserve the right to modify or discontinue features with notice.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>User Responsibilities:</Text> You are responsible for providing accurate information and using the app appropriately. Misuse of the service may result in account termination.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Intellectual Property:</Text> All content, features, and functionality are owned by Hilla and protected by copyright and other intellectual property laws.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Updates:</Text> These terms may be updated periodically. Continued use of the app constitutes acceptance of updated terms.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Governing Law:</Text> These terms are governed by the laws of the jurisdiction where Hilla is incorporated.
              </Text>
              <Text style={styles.modalBodyText}>
                <Text style={styles.modalBoldText}>Contact:</Text> For questions about these terms, contact us at support@hilla.app.
              </Text>
            </ScrollView>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.stepIndicator}>Step 12 of 13</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.stepHeader}>
          <View style={styles.iconContainer}>
            <Shield size={40} color="#B8A9FF" />
          </View>
          <Text style={styles.stepTitle}>Privacy & Disclaimer</Text>
          <Text style={styles.stepSubtitle}>
            Please review our policies before continuing
          </Text>
        </View>

        {/* Policy Cards - More Minimal Design */}
        <View style={styles.policiesContainer}>
          {/* Privacy Policy Card */}
          <TouchableOpacity 
            style={[styles.policyCard, styles.privacyCard]}
            onPress={() => openModal('privacy')}
            activeOpacity={0.7}
          >
            <View style={styles.policyIconContainer}>
              <Eye size={24} color="#FFFFFF" />
            </View>
            <View style={styles.policyContent}>
              <Text style={styles.policyTitle}>Privacy Policy</Text>
              <Text style={styles.policySubtitle}>GDPR Compliant Data Protection</Text>
              <Text style={styles.policySummary}>
                Your data is encrypted, processed on-device when possible, and you have full control.
              </Text>
              <View style={styles.readMoreContainer}>
                <Text style={styles.readMoreText}>Read Full Policy</Text>
                <ChevronRight size={14} color="#B8A9FF" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Medical Disclaimer Card */}
          <TouchableOpacity 
            style={[styles.policyCard, styles.medicalCard]}
            onPress={() => openModal('medical')}
            activeOpacity={0.7}
          >
            <View style={[styles.policyIconContainer, styles.medicalIconContainer]}>
              <FileText size={24} color="#FFFFFF" />
            </View>
            <View style={styles.policyContent}>
              <Text style={styles.policyTitle}>Medical Disclaimer</Text>
              <Text style={styles.policySubtitle}>Important Health Notice</Text>
              <Text style={styles.policySummary}>
                Hilla provides nutritional guidance only. Always consult healthcare professionals.
              </Text>
              <View style={styles.readMoreContainer}>
                <Text style={styles.readMoreText}>Read Full Disclaimer</Text>
                <ChevronRight size={14} color="#FF8F65" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Terms of Service Card */}
          <TouchableOpacity 
            style={[styles.policyCard, styles.termsCard]}
            onPress={() => openModal('terms')}
            activeOpacity={0.7}
          >
            <View style={[styles.policyIconContainer, styles.termsIconContainer]}>
              <Scale size={24} color="#FFFFFF" />
            </View>
            <View style={styles.policyContent}>
              <Text style={styles.policyTitle}>Terms of Service</Text>
              <Text style={styles.policySubtitle}>Usage Agreement</Text>
              <Text style={styles.policySummary}>
                Guidelines for responsible app usage and our service commitments to you.
              </Text>
              <View style={styles.readMoreContainer}>
                <Text style={styles.readMoreText}>Read Full Terms</Text>
                <ChevronRight size={14} color="#7FDDAA" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <TouchableOpacity 
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <ArrowUp size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Fixed Bottom Agreement Section */}
      <View style={styles.agreementSection}>
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={handleCheckboxToggle}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <Check size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxText}>
            I understand that Hilla is not a substitute for professional medical care and I agree to the privacy policy and terms of service.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.agreeButton,
            !isChecked && styles.agreeButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isChecked}
          activeOpacity={0.8}
        >
          <Text style={styles.agreeButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={activeModal !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {renderModalContent()}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FAFBFC',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  stepIndicator: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  placeholder: {
    width: 40,
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 20,
  },
  stepHeader: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  policiesContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  policyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  privacyCard: {
    borderColor: '#B8A9FF',
    backgroundColor: '#F8F6FF',
  },
  medicalCard: {
    borderColor: '#FF8F65',
    backgroundColor: '#FFF7ED',
  },
  termsCard: {
    borderColor: '#7FDDAA',
    backgroundColor: '#F0FDFA',
  },
  policyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B8A9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#B8A9FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  medicalIconContainer: {
    backgroundColor: '#FF8F65',
    shadowColor: '#FF8F65',
  },
  termsIconContainer: {
    backgroundColor: '#7FDDAA',
    shadowColor: '#7FDDAA',
  },
  policyContent: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  policySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 12,
  },
  policySummary: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  readMoreText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#B8A9FF',
  },
  scrollToTopButton: {
    position: 'absolute',
    right: 24,
    bottom: 140,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B8A9FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B8A9FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  agreementSection: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#B8A9FF',
    borderColor: '#B8A9FF',
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 18,
  },
  agreeButton: {
    backgroundColor: '#B8A9FF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#B8A9FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  agreeButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  agreeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  modalScrollView: {
    flex: 1,
  },
  modalBodyText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
  modalBoldText: {
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
});