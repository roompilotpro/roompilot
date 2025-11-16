package com.roompilot.service;

import static com.roompilot.fixtures.TestConstants.TestData.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.roompilot.model.Message;
import com.roompilot.repository.MessageRepository;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class MessageServiceTest {

  @Mock private MessageRepository messageRepository;

  @InjectMocks private MessageService messageService;

  private Message testMessage;

  @BeforeEach
  void setUp() {
    testMessage = new Message(TEST_MESSAGE_CONTENT);
    testMessage.setId(TEST_MESSAGE_ID);
  }

  @Test
  void testGetAllMessages() {
    // Arrange
    List<Message> messages = Arrays.asList(testMessage, new Message(ANOTHER_MESSAGE_CONTENT));
    when(messageRepository.findAllByOrderByCreatedAtDesc()).thenReturn(messages);

    // Act
    List<Message> result = messageService.getAllMessages();

    // Assert
    assertNotNull(result);
    assertEquals(2, result.size());
    verify(messageRepository, times(1)).findAllByOrderByCreatedAtDesc();
  }

  @ParameterizedTest
  @MethodSource("provideMessagesById")
  void testGetMessageById(
      long id,
      Optional<Message> repositoryResult,
      boolean expectedPresent,
      String expectedContent) {
    when(messageRepository.findById(id)).thenReturn(repositoryResult);

    Optional<Message> result = messageService.getMessageById(id);

    assertEquals(expectedPresent, result.isPresent());
    if (expectedPresent) {
      assertEquals(expectedContent, result.get().getContent());
    }
    verify(messageRepository, times(1)).findById(id);
  }

  @Test
  void testCreateMessage() {
    // Arrange
    String content = NEW_MESSAGE_CONTENT;
    Message newMessage = new Message(content);
    when(messageRepository.save(any(Message.class))).thenReturn(newMessage);

    // Act
    Message result = messageService.createMessage(content);

    // Assert
    assertNotNull(result);
    assertEquals(content, result.getContent());
    verify(messageRepository, times(1)).save(any(Message.class));
  }

  @ParameterizedTest
  @MethodSource("provideUpdateMessages")
  void testUpdateMessage(
      long id,
      String updatedContent,
      Optional<Message> repositoryResult,
      boolean expectSuccess,
      Class<? extends Exception> expectedException) {
    when(messageRepository.findById(id)).thenReturn(repositoryResult);

    if (expectSuccess) {
      when(messageRepository.save(any(Message.class)))
          .thenReturn(repositoryResult.orElse(testMessage));
      Message result = messageService.updateMessage(id, updatedContent);

      assertNotNull(result);
      assertEquals(updatedContent, result.getContent());
      verify(messageRepository, times(1)).save(repositoryResult.orElse(testMessage));
    } else {
      assertThrows(
          expectedException,
          () -> {
            messageService.updateMessage(id, updatedContent);
          });
      verify(messageRepository, never()).save(any(Message.class));
    }

    verify(messageRepository, times(1)).findById(id);
  }

  @Test
  void testDeleteMessage() {
    // Arrange
    doNothing().when(messageRepository).deleteById(TEST_MESSAGE_ID);

    // Act
    messageService.deleteMessage(TEST_MESSAGE_ID);

    // Assert
    verify(messageRepository, times(1)).deleteById(TEST_MESSAGE_ID);
  }

  private Stream<Arguments> provideMessagesById() {
    return Stream.of(
        Arguments.of(
            TEST_MESSAGE_ID,
            Optional.of(createMessageWithId(TEST_MESSAGE_ID, TEST_MESSAGE_CONTENT)),
            true,
            TEST_MESSAGE_CONTENT),
        Arguments.of(NONEXISTENT_MESSAGE_ID, Optional.<Message>empty(), false, null));
  }

  private Stream<Arguments> provideUpdateMessages() {
    return Stream.of(
        Arguments.of(
            TEST_MESSAGE_ID,
            UPDATED_MESSAGE_CONTENT,
            Optional.of(createMessageWithId(TEST_MESSAGE_ID, "Original")),
            true,
            null),
        Arguments.of(
            NONEXISTENT_MESSAGE_ID,
            UPDATED_MESSAGE_CONTENT,
            Optional.<Message>empty(),
            false,
            RuntimeException.class));
  }

  private Message createMessageWithId(long id, String content) {
    Message message = new Message(content);
    message.setId(id);
    return message;
  }
}
