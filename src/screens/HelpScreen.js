import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';

function MessageBubble({ isAssistant, text, textAlign }) {
  return (
    <View style={[styles.messageRow, isAssistant ? styles.assistantRow : styles.userRow]}>
      <View style={[styles.messageBubble, isAssistant ? styles.assistantBubble : styles.userBubble]}>
        <Text
          style={[
            styles.messageText,
            isAssistant ? styles.assistantText : styles.userText,
            { textAlign },
          ]}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

export default function HelpScreen() {
  const { language, t, textAlign } = useLanguage();
  const [conversation, setConversation] = useState([
    {
      id: 'greeting',
      role: 'assistant',
      text: t('screens.help.greeting'),
    },
  ]);

  const [showQuestionChoices, setShowQuestionChoices] = useState(true);

  useEffect(() => {
    setConversation([
      {
        id: 'greeting',
        role: 'assistant',
        text: t('screens.help.greeting'),
      },
    ]);
    setShowQuestionChoices(true);
  }, [language, t]);

  const questionItems = useMemo(
    () => [
      {
        id: 'recycle',
        question: t('screens.help.questions.recycle.question'),
        answer: t('screens.help.questions.recycle.answer'),
      },
      {
        id: 'code',
        question: t('screens.help.questions.code.question'),
        answer: t('screens.help.questions.code.answer'),
      },
      {
        id: 'points',
        question: t('screens.help.questions.points.question'),
        answer: t('screens.help.questions.points.answer'),
      },
      {
        id: 'plastic',
        question: t('screens.help.questions.plastic.question'),
        answer: t('screens.help.questions.plastic.answer'),
      },
      {
        id: 'classification',
        question: t('screens.help.questions.classification.question'),
        answer: t('screens.help.questions.classification.answer'),
      },
      {
        id: 'map',
        question: t('screens.help.questions.map.question'),
        answer: t('screens.help.questions.map.answer'),
      },
      {
        id: 'methods',
        question: t('screens.help.questions.methods.question'),
        answer: t('screens.help.questions.methods.answer'),
      },
      {
        id: 'invalidCode',
        question: t('screens.help.questions.invalidCode.question'),
        answer: t('screens.help.questions.invalidCode.answer'),
      },
      {
        id: 'cleanliness',
        question: t('screens.help.questions.cleanliness.question'),
        answer: t('screens.help.questions.cleanliness.answer'),
      },
      {
        id: 'smartCities',
        question: t('screens.help.questions.smartCities.question'),
        answer: t('screens.help.questions.smartCities.answer'),
      },
    ],
    [t]
  );

  function handleQuestionSelect(item) {
    setConversation((currentConversation) => [
      ...currentConversation,
      {
        id: `user-${item.id}-${currentConversation.length}`,
        role: 'user',
        text: item.question,
      },
      {
        id: `assistant-${item.id}-${currentConversation.length}`,
        role: 'assistant',
        text: item.answer,
      },
    ]);
    setShowQuestionChoices(false);
  }

  function handleAskAnotherQuestion() {
    setConversation((currentConversation) => [
      ...currentConversation,
      {
        id: `assistant-followup-${currentConversation.length}`,
        role: 'assistant',
        text: t('screens.help.followUpPrompt'),
      },
    ]);
    setShowQuestionChoices(true);
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={[styles.badge, { textAlign }]}>{t('screens.help.badge')}</Text>
          <Text style={[styles.title, { textAlign }]}>{t('screens.help.title')}</Text>
          <Text style={[styles.description, { textAlign }]}>{t('screens.help.description')}</Text>
        </View>

        <View style={styles.chatCard}>
          <Text style={[styles.assistantHeading, { textAlign }]}>
            {t('screens.help.assistantTitle')}
          </Text>
          <Text style={[styles.assistantSubheading, { textAlign }]}>
            {t('screens.help.assistantBody')}
          </Text>

          <View style={styles.chatThread}>
            {conversation.map((message) => (
              <MessageBubble
                key={message.id}
                isAssistant={message.role === 'assistant'}
                text={message.text}
                textAlign={textAlign}
              />
            ))}
          </View>

          {showQuestionChoices ? (
            <View style={styles.choicesSection}>
              <Text style={[styles.choicePrompt, { textAlign }]}>
                {t('screens.help.choicePrompt')}
              </Text>
              <View style={styles.choiceList}>
                {questionItems.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleQuestionSelect(item)}
                    style={styles.choiceChip}
                  >
                    <Text style={[styles.choiceChipText, { textAlign }]}>{item.question}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.actionSection}>
              <Pressable onPress={handleAskAnotherQuestion} style={styles.primaryButton}>
                <Text style={styles.primaryButtonLabel}>{t('screens.help.askAnotherQuestion')}</Text>
              </Pressable>
              <Pressable onPress={handleAskAnotherQuestion} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonLabel}>{t('screens.help.showQuestionsAgain')}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xl,
  },
  heroCard: {
    backgroundColor: theme.colors.primarySurface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  badge: {
    color: theme.colors.primaryStrong,
    fontSize: theme.typography.caption,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.primaryStrong,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  chatCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  assistantHeading: {
    color: theme.colors.primaryStrong,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  assistantSubheading: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  chatThread: {
    marginBottom: theme.spacing.lg,
    rowGap: theme.spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    borderRadius: theme.radius.lg,
    maxWidth: '86%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  assistantBubble: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
  },
  assistantText: {
    color: theme.colors.textSecondary,
  },
  userText: {
    color: theme.colors.textOnPrimary,
  },
  choicesSection: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingTop: theme.spacing.md,
  },
  choicePrompt: {
    color: theme.colors.primaryStrong,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  choiceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  choiceChip: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.borderStrong,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  choiceChipText: {
    color: theme.colors.primaryStrong,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  actionSection: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingTop: theme.spacing.md,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: theme.spacing.lg,
  },
  primaryButtonLabel: {
    color: theme.colors.textOnPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    minHeight: 52,
    paddingHorizontal: theme.spacing.lg,
  },
  secondaryButtonLabel: {
    color: theme.colors.primaryStrong,
    fontSize: 15,
    fontWeight: '700',
  },
});
