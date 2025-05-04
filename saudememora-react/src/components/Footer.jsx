import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start mt-5 border-top py-3">
      <div className="container text-center">
        <span className="text-muted">
          &copy; {new Date().getFullYear()} Saúde Memora. Todos os direitos reservados.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
