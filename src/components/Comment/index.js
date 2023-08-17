import React, { useEffect, useState } from 'react';
import {
  List,
  Comment,
  Input,
  Button,
  Popover,
  Menu,
  Modal,
  message,
} from 'antd';
import dayjs from 'dayjs';
import styles from './index.less';

const { confirm } = Modal;
const { TextArea } = Input;

let id = 1;

const CommentComponent = ({ commentMaxWord = 200 }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const getComment = async () => {
    setCommentLoading(true);
    setTimeout(() => {
      setCommentLoading(false);
    }, 1000);
  };

  const onSubmit = async () => {
    if (!commentText) return;
    setSubmitting(true);
    setTimeout(() => {
      setComments(prev => [
        ...prev,
        {
          content: commentText,
          id: id++,
          author: 'lix',
          datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
      ]);
      setCommentText('');
      setSubmitting(false);
    }, 600);
    // const [e, r] = await api.comment({
    //   pid: 0,
    //   resourcesId: id,
    //   type,
    //   sysType: 1,
    //   content: commentText,
    // });
    // if (!e) {
    //   message.info(r.message);
    //   setSubmitting(false);
    //   setCommentText('');
    //   onChange();
    // }
  };
  const onComment = async commentId => {
    if (!replyText) return;
    setCommentLoading(true);
    setTimeout(() => {
      setComments(prev => {
        const newComments = prev.map(comment => {
          return { ...comment, showInput: null };
        });
        newComments.push({
          id: id++,
          content: replyText,
          quote: newComments.find(comment => comment.id === commentId),
          author: 'lix',
          datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        });
        return newComments;
      });
      setReplyText('');
      setCommentLoading(false);
    }, 600);
  };

  useEffect(() => {
    getComment();
  }, []);

  return (
    <div className={styles.comment_component}>
      <Comment
        className={styles.editor}
        content={
          <>
            <TextArea
              className={styles.comment_area}
              maxLength={commentMaxWord}
              onChange={({ target: { value } }) => setCommentText(value)}
              rows={4}
              value={commentText}
            />
            <Button
              className={styles.comment_btn}
              loading={submitting}
              onClick={onSubmit}
              type="primary"
            >
              发表评论
            </Button>
          </>
        }
      />
      {comments.length > 0 && (
        <List
          className={styles.list}
          dataSource={comments}
          itemLayout="horizontal"
          loading={commentLoading}
          renderItem={item => (
            <Comment
              actions={[
                <Button
                  key="reply"
                  onClick={() => {
                    setComments(prev => {
                      return prev.map(comment => {
                        if (comment.id === item.id) {
                          return { ...comment, showInput: { status: 'reply' } };
                        } else {
                          return { ...comment, showInput: null };
                        }
                      });
                    });
                    setReplyText('');
                  }}
                  type="link"
                >
                  回复
                </Button>,
                <Popover
                  placement="bottom"
                  key="more"
                  overlayClassName={styles.comment_more_menu}
                  content={
                    !commentLoading && (
                      <Menu
                        onClick={({ key }) => {
                          const [type, id] = key.split('_');
                          if (type === 'del') {
                            confirm({
                              title: '确定删除这条评论吗？',
                              okText: '确定',
                              okType: 'danger',
                              cancelText: '取消',
                              onOk() {
                                return new Promise(async resolve => {
                                  setCommentLoading(true);
                                  setTimeout(() => {
                                    setComments(prev => {
                                      const index = prev.findIndex(
                                        item => item.id === Number(id)
                                      );
                                      if (index > -1) {
                                        prev.splice(index, 1);
                                      }
                                      return [...prev];
                                    });
                                    resolve();
                                    setCommentLoading(false);
                                  }, 500);
                                });
                              },
                            });
                          } else if (type === 'edit') {
                            setComments(prev => {
                              return prev.map(comment => {
                                if (comment.id === Number(id)) {
                                  return {
                                    ...comment,
                                    showInput: {
                                      status: 'edit',
                                    },
                                  };
                                } else {
                                  return { ...comment, showInput: null };
                                }
                              });
                            });
                            setReplyText(item.content);
                          }
                        }}
                      >
                        <Menu.Item key={`edit_${item.id}`}>编辑</Menu.Item>
                        <Menu.Item key={`del_${item.id}`}>删除</Menu.Item>
                      </Menu>
                    )
                  }
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  <Button
                    type="link"
                    style={{
                      display: item.id % 2 === 0 ? 'inline-block' : 'none',
                    }}
                  >
                    更多
                  </Button>
                </Popover>,
              ]}
              author={item.author}
              content={item.content}
              datetime={item.datetime}
            >
              {item.quote && (
                <div className={styles.comment_quote}>
                  <Comment
                    author={item.quote.author}
                    datetime={item.quote.datetime}
                    content={item.quote.content}
                  ></Comment>
                </div>
              )}
              {item.showInput && (
                <div className={styles.replyWrapper}>
                  <TextArea
                    className={styles.comment_area}
                    maxLength={commentMaxWord}
                    onChange={({ target: { value } }) => setReplyText(value)}
                    rows={4}
                    value={replyText}
                  />
                  <div className={styles.replyBtns}>
                    <Button
                      onClick={() => {
                        setComments(prev => {
                          return prev.map(comment => {
                            return { ...comment, showInput: null };
                          });
                        });
                        setReplyText('');
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      type="primary"
                      style={{ marginLeft: 10 }}
                      onClick={() => {
                        if (item.showInput.status === 'reply') {
                          onComment(item.id);
                        } else if (item.showInput.status === 'edit') {
                          setCommentLoading(true);
                          setTimeout(() => {
                            setComments(prev => {
                              return prev.map(comment => {
                                if (comment.id === item.id) {
                                  return {
                                    ...comment,
                                    content: replyText,
                                    showInput: null,
                                  };
                                } else {
                                  return { ...comment, showInput: null };
                                }
                              });
                            });
                            setReplyText('');
                            setCommentLoading(false);
                          }, 600);
                        }
                      }}
                    >
                      {item.showInput.status === 'reply' ? '回复' : '编辑'}
                    </Button>
                  </div>
                </div>
              )}
            </Comment>
          )}
        />
      )}
    </div>
  );
};

export default CommentComponent;
