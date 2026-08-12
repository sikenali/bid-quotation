import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-dark-bg">
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-full bg-[#C43A31]/10 flex items-center justify-center mx-auto mb-4">
              <i className="ri-error-warning-line text-3xl text-[#C43A31]"></i>
            </div>
            <h1 className="text-xl font-semibold text-text dark:text-dark-text mb-2">页面出错了</h1>
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm mb-6">
              {this.state.error?.message || '发生了意外错误，请刷新页面重试'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mx-auto"
            >
              <i className="ri-refresh-line"></i>
              <span>刷新页面</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}