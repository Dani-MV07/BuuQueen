import { Component } from 'react';
import ErrorState from './ErrorState';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error de renderizado en la aplicación:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorState message="Se ha producido un error inesperado en la aplicación." />;
    }

    return this.props.children;
  }
}
