import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Spinner } from 'react-bootstrap';
import axiosInstance from '../../axiosConfig';

const ImageWithDelay = ({ tipo, id }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoaded(true);
    }, 300); // atraso de 300ms

    return () => clearTimeout(timeout);
  }, [id, tipo]);

  if (!tipo || !id) {
    return <p>Tipo ou ID inválidos</p>;
  }

  return loaded ? (
    <div
      className="border-top bg-light"
      style={{
        height: "350px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={5}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={`${urlBase}/api/${tipo}/imagem/${id}`}
            alt={`Imagem de ${tipo}`}
            className="img-fluid rounded shadow"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
              cursor: "grab",
            }}
            onError={(e) => {
              e.target.src = "";
              e.target.alt = "Imagem não encontrada";
            }}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  ) : (
    <div className="text-center py-4">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2">Carregando imagem...</p>
    </div>
  );
};

export default ImageWithDelay;
